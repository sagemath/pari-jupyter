# distutils: libraries = pari gmp

cdef extern from "pari/pari.h" nogil:
    ctypedef unsigned long ulong "pari_ulong"
    ctypedef long* GEN
    ctypedef void* pari_sp

    long    paricfg_version_code
    long    PARI_VERSION_SHIFT

    pari_sp avma
    GEN     gnil

    int     INIT_JMPm, INIT_SIGm, INIT_DFTm, INIT_noPRIMEm, INIT_noIMTm
    void    pari_init_opts(size_t parisize, ulong maxprime, ulong init_opts)
    void    pari_init(size_t parisize, ulong maxprime)
    void    pari_sighandler(int sig)

    void    (*cb_pari_err_recover)(long)

    void    pari_free(void*)

    GEN     gp_read_file_from_str(char *t)
    char*   GENtostr(GEN x)

    struct PariOUT:
        void (*putch)(char)
        void (*puts)(const char*)
        void (*flush)()
    PariOUT* pariOut
    PariOUT* pariErr

