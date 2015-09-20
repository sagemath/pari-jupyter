from .paridecl cimport GEN, entree

cdef extern from "pari/paripriv.h" nogil:
    long is_keyword_char(char c)

    long functions_tblsz
    entree** functions_hash
    entree** defaults_hash
