#!/usr/bin/env python

from distutils.core import setup
from Cython.Build import cythonize

setup(
    name='pari_jupyter',
    version="0.0.0",
    description='A Jupyter kernel for PARI/GP',
    author='Jeroen Demeyer',
    author_email='jdemeyer@cage.ugent.be',
    license='GNU Public License (GPL) version 3 or later',
    packages=['PARIKernel'],
    ext_modules=cythonize("PARIKernel/*.pyx")
)

from jupyter_client.kernelspec import install_kernel_spec
install_kernel_spec("spec", 'pari_jupyter', user=True, replace=True)
