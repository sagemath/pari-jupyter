#!/usr/bin/env python

import os
from glob import glob
from distutils.core import setup, Extension
from distutils.version import StrictVersion
from setuptools.command.install import install as _install
import PARIKernel

kernelpath = os.path.join("share", "jupyter", "kernels", "pari_jupyter")
nbextpath = os.path.join("share", "jupyter", "nbextensions", "gp-mode")

try:
    from Cython.Build import build_ext
except ImportError:
    # No Cython
    ext = ".c"
    cmdclass = {}
else:
    # Use Cython
    ext = ".pyx"
    cmdclass = dict(build_ext=build_ext)

extensions = [Extension("PARIKernel.kernel", ["PARIKernel/kernel"+ext], libraries=["pari", "readline"]),
              Extension("PARIKernel.io", ["PARIKernel/io"+ext], libraries=["pari"])]


# Are SVG graphics available?
from subprocess import Popen, PIPE
gp = Popen("gp -f -q", shell=True, stdin=PIPE, stdout=PIPE, stderr=PIPE)
gp.communicate(b'''iferr(install(pari_set_plot_engine, "vL"), E, quit(1));''')
HAVE_SVG = (gp.wait() == 0)

if HAVE_SVG:
    ext = Extension("PARIKernel.svg", ["PARIKernel/svg"+ext], libraries=["pari"])
    extensions.append(ext)

class install(_install):
    def run(self):
        from notebook.nbextensions import enable_nbextension
        _install.run(self)
        enable_nbextension('notebook', 'gp-mode/main')

cmdclass['install']=install

setup(
    name='pari_jupyter',
    version=PARIKernel.__version__,
    description='A Jupyter kernel for PARI/GP',
    long_description=open("README.rst").read(),
    platforms=["POSIX"],
    author='Jeroen Demeyer',
    author_email='J.Demeyer@UGent.be',
    license='GNU General Public License (GPL) version 3 or later',
    url="https://github.com/jdemeyer/pari_jupyter",
    classifiers=["Development Status :: 5 - Production/Stable",
                 "License :: OSI Approved :: GNU General Public License v3 or later (GPLv3+)",
                 "Operating System :: POSIX",
                 "Programming Language :: Cython",
                 "Intended Audience :: Science/Research",
                 "Topic :: Scientific/Engineering :: Mathematics",
                ],
    install_requires=['ipykernel'],

    packages=['PARIKernel'],
    ext_modules=extensions,
    data_files=[(kernelpath, glob("spec/*")), (nbextpath, glob("gp-mode/*"))],
    cmdclass=cmdclass,
)
