#!/usr/bin/env python

import os
from glob import glob
from setuptools import setup, Extension
from setuptools.command.bdist_egg import bdist_egg as _bdist_egg

kernelpath = os.path.join("share", "jupyter", "kernels", "pari_jupyter")
nbextpath = os.path.join("share", "jupyter", "nbextensions", "gp-mode")
nbconfpath = os.path.join("etc", "jupyter", "nbconfig", "notebook.d")

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


class no_egg(_bdist_egg):
    def run(self):
        from distutils.errors import DistutilsOptionError
        raise DistutilsOptionError("The package pari-jupyter will not function correctly when built as egg. Therefore, it cannot be installed using 'python setup.py install' or 'easy_install'. Instead, use 'pip install' to install this package.")

cmdclass['bdist_egg'] = no_egg


setup(
    packages=['PARIKernel'],
    ext_modules=extensions,
    data_files=[(kernelpath, glob("spec/*")),
                (nbextpath, glob("gp-mode/*")),
                (nbconfpath, ["gp-mode.json"]),
    ],
    cmdclass=cmdclass,
)
