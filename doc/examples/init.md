---
jupytext:
  formats: ipynb,md:myst
  text_representation:
    extension: .md
    format_name: myst
    format_version: 0.13
    jupytext_version: 1.13.0
kernelspec:
  display_name: PARI/GP 12.3
  name: pari_jupyter
---

# Introduction to PARI/GP

Based on B. Allombert pdf presentation available at http://pari.math.u-bordeaux.fr/Events/PARI2019b/talks/init.pdf

## Introduction

- PARI is a C library, allowing fast computations
- gp is an easy-touse interactive shell giving access to the PARI functions
- GP is the name of gp's scripting language
- gp2c is the gp GP to PARI compiler allows to convert GP scripts to C

# Basic objects

`I` is the imaginary unit and `x` a symbolic variable
```{code-cell} gp
57!
2 / 6
(1+I)^2
(x+1)^(-2)
```
Modular computations
```{code-cell}
Mod(2,5)^3
Mod(x, x^2+x+1)^3
w = ffgen([3,5],'w); w^12 \\ in F_3^5
```
Usual constants and functions (`%` is the value of the last command while `%12` is the value of the 12-th command)
```{code-cell} gp
Pi
log(2)
\p100
log(2)
exp(%)
log(1+x)
exp(%12)
```

## Help

To access documentation, use the question mark `?` followed by 
```{code-cell} gp
?4
?atan
```

With two question marks `??` you access ?
```{code-cell} gp
??atan
??refcard
??refcard-nf
??tutorial
```
And what about 3
```{code-cell} gp
???determinant
```

## Vectors and matrices

```{code-cell} gp
V = [1,2,3];
W = [4,5,6]~;
M = [1,2,3;4,5,6];
```
and products
```{code-cell} gp
V*W
M*W
```
What is the name for this
```{code-cell} gp
U = [1..10]
```

## Components

Can be used to extract subvector or submatrix
```{code-cell} gp
V[2]
W[1..2]
M[2,2]
M[1,]
M[,2]
M[1..2,1..2]
```

## Polymorphism

```{code-cell} gp
\o0
```
Then can factor
```{code-cell} gp
factor(91)
factor(x^4+4)
factor((x^4+1)*Mod(1,a^2-2))
factor((x^4+4)*Mod(1,13))
factor(x^4+1,Mod(1,a^2-2))
factor(x^4+1,Mod(1,13))
```

## Numerical summation
```{code-cell} gp
intnum(x=0,1,1/(1+x^2))/Pi
sumnum(n=1,1/n^2)/Pi^2
sumalt(n=0,(-1)^n/(2*n+1))*4
sumalt(n=1,(-1)^n*log(n)) \\ diverging!
2*exp(2*%)
```

## Comprehension
```{code-cell} gp
[n^2|n<-[1..10]]
[n^2|n<-[1..10],isprime(n)]
[n^2|n<-primes([1,10])]
[a,b] = [1,2];
print("a=",a," b=",b)
```

## Control structures

- `if(cond, expr_true{, expr_false})`
- `while(cond, expr)`
- `for(var=start, end, expr(var))`
- `forstep(var=start, end, step, expr(var))`
- `forprime(var=start, end, expr(var))`
- `fordiv(N, var, expr(var))`

## Memory

To configure the memory used by PARI, in the file `.gprc` (or
`gprc.txt` under Windows) add the line

    parisizemax=1G

or do

```{code-cell} gp
default(parisizemax,"1G");
```
