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

extensions = [Extension("PARIKernel.kernel", ["PARIKernel/kernel"+ext], libraries=["pari", "readline"]),
              Extension("PARIKernel.io", ["PARIKernel/io"+ext], libraries=["pari"])]

if USE_CYTHON:
    from Cython.Build import cythonize
    extensions = cythonize(extensions)

setup(
    name='pari_jupyter',
    version=PARIKernel.__version__,
    description='A Jupyter kernel for PARI/GP',
    long_description=open("README.rst").read(),
    platforms=["POSIX"],
    author='Jeroen Demeyer',
    author_email='jdemeyer@cage.ugent.be',
    license='GNU General Public License (GPL) version 3 or later',
    url="https://github.com/jdemeyer/pari_jupyter",
    classifiers=["Development Status :: 5 - Production/Stable",
                 "License :: OSI Approved :: GNU General Public License v3 or later (GPLv3+)",
                 "Operating System :: POSIX",
                 "Programming Language :: Cython",
                 "Intended Audience :: Science/Research",
                 "Topic :: Scientific/Engineering :: Mathematics",
                ],

    packages=['PARIKernel'],
    ext_modules=extensions,
    data_files=[(kernelpath, glob("spec/*"))],
)
