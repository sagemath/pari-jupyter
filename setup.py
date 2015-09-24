#!/usr/bin/env python

import os, sysconfig
from distutils.core import setup
from Cython.Build import cythonize

kernelpath = os.path.join(sysconfig.get_config_var("datarootdir"),
        "jupyter", "kernels", "pari_jupyter")

setup(
    name='pari_jupyter',
    version="0.0.0",
    description='A Jupyter kernel for PARI/GP',
    author='Jeroen Demeyer',
    author_email='jdemeyer@cage.ugent.be',
    license='GNU Public License (GPL) version 3 or later',
    packages=['PARIKernel'],
    ext_modules=cythonize("PARIKernel/*.pyx"),
    data_files=[(kernelpath, ["spec/kernel.json"])],
)
