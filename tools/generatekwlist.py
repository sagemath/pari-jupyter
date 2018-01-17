#!/usr/bin/env python
"""
Extract PARI/GP function names from pari.desc file

The purpose is to build the list of builtin function for the gp-mode
notebook extension. The list is composed by function of ``Class: basic``
minus a blacklist and all the functions beginning with '_'
"""
__author__ = "Vincent Klein"


import argparse

parser = argparse.ArgumentParser()
parser.add_argument("pari_desc_file", help="path to pari.desc file")
args = parser.parse_args()

# list of builtin function names
f_list = []
# list of names to filter
blacklist = ['!_', '#_', '%', '%#', '+_', '-_', 'O(_^_)', '[_.._]', '[_|_<-_,_;_]', '[_|_<-_,_]']

cf = ''

with open(args.pari_desc_file) as f_in:
    for l in f_in.readlines():
        if l.startswith('Function: '):
            cf = l[10:].strip()
        elif l.startswith('Class: '):
            f_class = l[7:].strip()
            if f_class == 'basic' and cf not in blacklist and not cf.startswith('_'):
                f_list.append(cf)


# write the list in a friendly copy/paste way
linemaxchar = 80

line = ""
for func in f_list:
    if line:
        t = line + ", '{0}'".format(func)
        if len(t) < linemaxchar:
            line = t
            continue
        print(line + ",")

    line = "    '{0}'".format(func)

print(line)
