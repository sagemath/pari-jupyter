#
# Jupyter kernel for PARI/GP
#
# Copyright (C) 2015 Jeroen Demeyer
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.
#


from .paridecl cimport *
from .paripriv cimport *
from .io cimport PARIKernelIO
from libc.setjmp cimport *
from libc.string cimport memset, strncmp
from ipykernel.kernelbase import Kernel
from libc.signal cimport SIGALRM, SIGINT
from posix.signal cimport sigaction, sigaction_t

DEF PARISIZE = 2**27
DEF PRIMELIMIT = 500000


# Global setjmp() context for error handling
cdef sigjmp_buf context

cdef void pari_recover(long numerr) nogil:
    siglongjmp(context, -1)


# Helper functions
cdef inline PyString_FromGEN(GEN g):
    cdef char* s = GENtostr(g)
    cdef object pystr = s
    pari_free(s)
    return pystr


def pari_short_version():
    cdef unsigned long mask = (1<<PARI_VERSION_SHIFT) - 1;
    cdef unsigned long n = paricfg_version_code

    cdef unsigned long patch = n & mask
    n >>= PARI_VERSION_SHIFT
    cdef unsigned long minor = n & mask
    n >>= PARI_VERSION_SHIFT
    cdef unsigned long major = n
    return "{}.{}.{}".format(major, minor, patch)


cdef inline bint is_keyword_char_python(s) except -1:
    """
    Given a Python single-character string ``s``, is it a PARI
    keyword character?
    """
    cdef long c
    try:
        c = ord(s)
    except TypeError:
        return 0
    return 32 <= c < 128 and is_keyword_char(c)


cdef list hashtable_matches(word, size_t prefixlen, entree** hashtable):
    """
    Return a list of all words starting with ``word`` in
    ``hashtable``. The first ``prefixlen`` characters of the returned
    words are stripped away.
    """
    cdef char* cword = word
    cdef size_t cwordlen = len(word)
    assert cwordlen >= prefixlen

    # Find word in PARI's hashtable
    cdef entree* ep
    cdef list matches = []
    cdef long i
    for i in range(functions_tblsz):
        ep = hashtable[i]
        while ep != NULL:
            if strncmp(ep.name, cword, cwordlen) == 0:
                matches.append(ep.name + prefixlen)
            ep = ep.next

    return matches


class PARIKernel(Kernel):
    implementation = 'PARI'
    implementation_version = '0.0.0'
    language = 'GP'
    language_version = pari_short_version()
    language_info = dict(mimetype='text/plain', name='GP', file_extension='gp')
    banner = "PARI kernel"

    def __init__(self, *args, **kwds):
        super(PARIKernel, self).__init__(*args, **kwds)

        pari_init_opts(PARISIZE, PRIMELIMIT, INIT_SIGm | INIT_DFTm)
        global cb_pari_err_recover, pariOut, pariErr
        cb_pari_err_recover = pari_recover
        self.io = PARIKernelIO(self)

    def do_execute(self, code, silent, store_history=True, user_expressions=None,
                   allow_stdin=False):
        global avma
        cdef pari_sp av = avma
        cdef GEN result
        cdef char* result_string
        cdef char* gp_code = code

        self.io.set_parent(self._parent_header)

        cdef sigaction_t sa
        cdef sigaction_t old_sa
        memset(&sa, 0, sizeof(sa))
        sa.sa_handler = pari_sighandler

        cdef int err
        with nogil:
            err = sigsetjmp(context, 1)
            if err == 0:  # Initial sigsetjmp() call
                sigaction(SIGINT, &sa, &old_sa)  # Handle SIGINT by PARI
                result = gp_read_file_from_str(gp_code)
            sigaction(SIGINT, &old_sa, &sa)      # Restore Python SIGINT handler

        if not err:  # success
            # gnil as a result is like Python's None, it should be
            # considered as "no result"
            if result != gnil and not silent:
                content = {
                        'execution_count': self.execution_count,
                        'data': {
                            'text/plain': PyString_FromGEN(result),
                        },
                        'metadata': {}
                }
                self.send_response(self.iopub_socket, 'execute_result', content)

            reply = {'status': 'ok',
                    # The base class increments the execution count
                    'execution_count': self.execution_count,
                    'payload': [],
                    'user_expressions': {},
                   }
        else:  # error (therefore no result)
            reply = {'status': 'error',
                    # The base class increments the execution count
                    'execution_count': self.execution_count,
                    'ename': "",
                    'evalue': "",
                    'traceback': [],
                   }

        avma = av
        self.io.flush()
        return reply

    def do_complete(self, code, cursor_pos):
        left = code[:cursor_pos]
        word, start, end = self.__get_keyword(left, cursor_pos)

        # If the word comes after a period, complete members
        cdef size_t prefixlen = 0
        if start >= 1 and code[start-1] == '.':
            word = "_." + word
            prefixlen = 2

        # Filter matches: first character should not be _
        # and all characters should be keyword characters
        cdef list matches = []
        cdef Py_ssize_t i
        for m in hashtable_matches(word, prefixlen, functions_hash):
            if m[0] == '_':    # Skip private functions
                continue
            for i in range(len(m)):
                if not is_keyword_char_python(m[i]):
                    break
            else:
                matches.append(m)

        reply = dict(status="ok", matches=sorted(matches),
                cursor_start=start, cursor_end=end)
        return reply

    def do_inspect(self, code, cursor_pos, detail_level=0):
        word = self.__get_keyword(code, cursor_pos)[0]
        # Possibly rewind if we are right after a "("
        if not word and cursor_pos > 0 and code[cursor_pos-1] == "(":
            word = self.__get_keyword(code, cursor_pos-1)[0]

        reply = dict(status="ok", found=False, data={}, metadata={})
        if not word:
            return reply

        cdef entree* ep = is_entry(word)
        if ep == NULL or ep.help == NULL:
            return reply

        reply["found"] = True
        reply["data"] = {"text/plain": ep.help}
        return reply

    def __get_keyword(self, code, pos):
        """
        Return a tuple ``(word, start, end)`` such that ``word`` is a
        PARI "keyword" and ``word = code[start:end]``. The bounds are
        such that ``start <= pos <= end``.
        """
        cdef Py_ssize_t start, end, length = len(code)
        start = end = pos
        while start > 0 and is_keyword_char_python(code[start-1]):
            start -= 1
        while end < length and is_keyword_char_python(code[end]):
            end += 1
        word = code[start:end]
        return (word, start, end)
