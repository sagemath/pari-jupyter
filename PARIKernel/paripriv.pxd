from .paridecl cimport GEN

cdef extern from "pari/paripriv.h" nogil:
    long is_keyword_char(char c)
