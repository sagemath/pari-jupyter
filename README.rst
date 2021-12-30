pari-jupyter
============

A `Jupyter <http://jupyter.org/>`_ kernel for
`PARI/GP <http://pari.math.u-bordeaux.fr/>`_.

Installation
------------

Install the dependencies listed below and run ::

    pip install pari-jupyter

Syntax highlighting
-------------------

On Jupyter notebook versions older than 5.3, syntax highlighting must be
explicitly enabled by running ::

    jupyter nbextension enable --sys-prefix gp-mode/main

Replace ``--sys-prefix`` by ``--user`` for a user installation.

Dependencies
------------

* `Python <https://www.python.org/>`_ (tested with version 2.7.14 and 3.6.1)
* `Jupyter <http://jupyter.org/>`_ 4
* `PARI <http://pari.math.u-bordeaux.fr/>`_ version 2.13 or later
* `Readline <http://cnswww.cns.cwru.edu/php/chet/readline/rltop.html>`_ (any version which works with PARI)
* Optional: `Cython <http://cython.org/>`_ version 0.25 or later

Running tests
-------------

There is a standalone python script in test/ that depends on `jupyter_kernel_test
<https://github.com/jupyter/jupyter_kernel_test>`_ (see the file
test/environment.yml for the precise dependency list that are run in the github
action using conda).
