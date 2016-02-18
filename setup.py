#!/usr/bin/env python

import os
from glob import glob
from distutils.core import setup, Extension
from distutils.version import StrictVersion
import PARIKernel

kernelpath = os.path.join("share", "jupyter", "kernels", "pari_jupyter")

USE_CYTHON = False

try:
    import Cython
    if StrictVersion(Cython.__version__) >= StrictVersion("0.24.0a0"):
        USE_CYTHON = True
except Exception:
    pass

ext = ".pyx" if USE_CYTHON else ".c"

extensions = [Extension("PARIKernel.kernel", ["PARIKernel/kernel"+ext]),
              Extension("PARIKernel.io", ["PARIKernel/io"+ext])]

if USE_CYTHON:
    from Cython.Build import cythonize
    extensions = cythonize(extensions)

setup(
    name='pari_jupyter',
    version=PARIKernel.__version__,
    description='A Jupyter kernel for PARI/GP',
    author='Jeroen Demeyer',
    author_email='jdemeyer@cage.ugent.be',
    license='GNU Public License (GPL) version 3 or later',
    url="https://github.com/jdemeyer/pari_jupyter",
    packages=['PARIKernel'],
    ext_modules=extensions,
    data_files=[(kernelpath, glob("spec/*"))],
)
