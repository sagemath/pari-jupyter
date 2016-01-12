#!/usr/bin/env python

import os
from glob import glob
from distutils.core import setup
from Cython.Build import cythonize
import PARIKernel

kernelpath = os.path.join("share", "jupyter", "kernels", "pari_jupyter")

setup(
    name='pari_jupyter',
    version=PARIKernel.__version__,
    description='A Jupyter kernel for PARI/GP',
    author='Jeroen Demeyer',
    author_email='jdemeyer@cage.ugent.be',
    license='GNU Public License (GPL) version 3 or later',
    url="https://github.com/jdemeyer/pari_jupyter",
    packages=['PARIKernel'],
    ext_modules=cythonize("PARIKernel/*.pyx"),
    data_files=[(kernelpath, glob("spec/*"))],
)
