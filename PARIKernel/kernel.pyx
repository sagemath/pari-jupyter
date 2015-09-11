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
from libc.setjmp cimport *
from libc.string cimport memset
from ipykernel.kernelbase import Kernel
from ipykernel.iostream import OutStream
from libc.signal cimport SIGALRM, SIGINT
from posix.signal cimport sigaction, sigaction_t

DEF PARISIZE = 2**27
DEF PRIMELIMIT = 500000


# Global setjmp() context for error handling
cdef sigjmp_buf context

cdef void pari_recover(long numerr) nogil:
    siglongjmp(context, -1)


cdef void out_putch(char c) nogil:
    cdef char s[2]
    s[0] = c
    s[1] = 0
    out_puts(s)

cdef void out_puts(const char* s) with gil:
    stdout_stream.write(s)

cdef void out_flush() with gil:
    stdout_stream.flush()

cdef void err_putch(char c) nogil:
    cdef char s[2]
    s[0] = c
    s[1] = 0
    err_puts(s)

cdef void err_puts(const char* s) with gil:
    stderr_stream.write(s)

cdef void err_flush() with gil:
    stderr_stream.flush()


cdef PariOUT PARIKernelOut
cdef PariOUT PARIKernelErr

PARIKernelOut.putch = out_putch
PARIKernelOut.puts = out_puts
PARIKernelOut.flush = out_flush
PARIKernelErr.putch = err_putch
PARIKernelErr.puts = err_puts
PARIKernelErr.flush = err_flush


cdef PyString_FromGEN(GEN g):
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


class PARIKernel(Kernel):
    implementation = 'PARI'
    implementation_version = '0.0.0'
    language = 'GP'
    language_version = pari_short_version()
    language_info = dict(mimetype='text/plain', name='GP', file_extension='gp')
    banner = "PARI kernel"

    def __init__(self, *args, **kwds):
        pari_init_opts(PARISIZE, PRIMELIMIT, INIT_SIGm | INIT_DFTm)
        global cb_pari_err_recover, pariOut, pariErr
        cb_pari_err_recover = pari_recover
        pariOut = &PARIKernelOut
        pariErr = &PARIKernelErr

        super(PARIKernel, self).__init__(*args, **kwds)
        global stdout_stream, stderr_stream
        stdout_stream = OutStream(self.session, self.iopub_socket,
                "stdout", pipe=False)
        stderr_stream = OutStream(self.session, self.iopub_socket,
                "stderr", pipe=False)

    def do_execute(self, code, silent, store_history=True, user_expressions=None,
                   allow_stdin=False):
        global avma
        cdef pari_sp av = avma
        cdef GEN result
        cdef char* result_string
        cdef char* gp_code = code

        stdout_stream.parent_header = self._parent_header
        stderr_stream.parent_header = self._parent_header

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
        stdout_stream.flush()
        stderr_stream.flush()
        return reply
