"""
generatekwlist.py: Extract pari gp function names from pari.desc file.
The purpose is to build the list of builtin function for the gp-mode Extension.
The list is composed by function of `class: basic` minus a blacklist and
all the functions beginning with '_'
"""
__author__ = "Vincent Klein"


import argparse
import os

parser = argparse.ArgumentParser()
parser.add_argument("pari_desc_dir", help="pari.desc file's directory")
args = parser.parse_args()

path = os.path.join(args.pari_desc_dir, "pari.desc")
f_in = open(path)

lines= f_in.readlines()
f_in.close()

# list of builtin function names
f_list = []
# list of names to filter
blacklist = ['!_', '#_', '%', '%#', '+_', '-_', 'O(_^_)', '[_.._]', '[_|_<-_,_;_]', '[_|_<-_,_]']

cf = ''
for l in lines:
    if l.startswith('Function: '):
        cf = l[10:].strip()
    elif l.startswith('Class: '):
        f_class = l[7:].strip()
        if f_class == 'basic' and cf not in blacklist and not cf.startswith('_'):
            f_list.append(cf)

# write the list in a friendly copy/paste way
linemaxchar = 80

f_out = open("builtinlist.txt", "w")
cline = ''
for k in f_list:
    cline += "'" + k + "', "
    if len(cline) >= linemaxchar:
        f_out.write(cline + '\n')
        cline = ''
f_out.close()

print('The builtin function list has been generated in file builtinlist.txt')
