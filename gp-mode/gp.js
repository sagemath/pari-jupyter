define([
  'codemirror/lib/codemirror',
  'codemirror/addon/mode/simple'
], function (CodeMirror) {
  'use strict';

  function createBuiltinRegularExpression(words) {
    return new RegExp(words.join('(?!\\\\[(),.]?|[\\w@]+)|') + '(?!\\\\[(),.]?|[\\w@]+)', 'm');
  }

    /*
        To update var builtin, use the script tools/generatekwlist.py the list
        is generated in the file tools/builtinlist.txt
    */
    var builtin = createBuiltinRegularExpression([
        'Catalan', 'Col', 'Colrev', 'Euler', 'I', 'List', 'Map', 'Mat', 'Mod', 'O', 'Pi',
        'Pol', 'Polrev', 'Qfb', 'Ser', 'Set', 'Str', 'Strchr', 'Strexpand', 'Strprintf',
        'Strtex', 'Vec', 'Vecrev', 'Vecsmall', 'abs', 'acos', 'acosh', 'addhelp', 'addprimes',
        'agm', 'alarm', 'algabsdim', 'algadd', 'algalgtobasis', 'algaut', 'algb', 'algbasis',
        'algbasistoalg', 'algcenter', 'algcentralproj', 'algchar', 'algcharpoly', 'algdecomposition',
        'algdegree', 'algdep', 'algdim', 'algdisc', 'algdivl', 'algdivr', 'alggroup', 'alghasse',
        'alghassef', 'alghassei', 'algindex', 'alginit', 'alginv', 'alginvbasis', 'algisassociative',
        'algiscommutative', 'algisdivision', 'algisdivl', 'algisinv', 'algisramified', 'algissemisimple',
        'algissimple', 'algissplit', 'alglathnf', 'algleftmultable', 'algmul', 'algmultable',
        'algneg', 'algnorm', 'algpoleval', 'algpow', 'algprimesubalg', 'algquotient', 'algradical',
        'algramifiedplaces', 'algrandom', 'algrelmultable', 'algsimpledec', 'algsplittingdata',
        'algsplittingfield', 'algsplittingmatrix', 'algsqr', 'algsub', 'algsubalg', 'algtableinit',
        'algtensor', 'algtrace', 'algtype', 'alias', 'allocatemem', 'apply', 'arg', 'asin',
        'asinh', 'asympnum', 'atan', 'atanh', 'bernfrac', 'bernpol', 'bernreal', 'bernvec',
        'besselh1', 'besselh2', 'besseli', 'besselj', 'besseljh', 'besselk', 'besseln',
        'bestappr', 'bestapprPade', 'bezout', 'bezoutres', 'bigomega', 'binary', 'binomial',
        'bitand', 'bitneg', 'bitnegimply', 'bitor', 'bitprecision', 'bittest', 'bitxor',
        'bnfcertify', 'bnfcompress', 'bnfdecodemodule', 'bnfinit', 'bnfisintnorm', 'bnfisnorm',
        'bnfisprincipal', 'bnfissunit', 'bnfisunit', 'bnflog', 'bnflogdegree', 'bnflogef',
        'bnfnarrow', 'bnfsignunit', 'bnfsunit', 'bnrL1', 'bnrchar', 'bnrclassno', 'bnrclassnolist',
        'bnrconductor', 'bnrconductorofchar', 'bnrdisc', 'bnrdisclist', 'bnrgaloisapply',
        'bnrgaloismatrix', 'bnrinit', 'bnrisconductor', 'bnrisgalois', 'bnrisprincipal',
        'bnrrootnumber', 'bnrstark', 'break', 'call', 'ceil', 'centerlift', 'characteristic',
        'charconj', 'chardiv', 'chareval', 'charker', 'charmul', 'charorder', 'charpoly',
        'chinese', 'cmp', 'component', 'concat', 'conj', 'conjvec', 'content', 'contfrac',
        'contfraceval', 'contfracinit', 'contfracpnqn', 'core', 'coredisc', 'cos', 'cosh',
        'cotan', 'cotanh', 'dbg_x', 'default', 'denominator', 'deriv', 'derivnum', 'diffop',
        'digits', 'dilog', 'dirdiv', 'direuler', 'dirmul', 'dirzetak', 'divisors', 'divrem',
        'eint1', 'ellL1', 'elladd', 'ellak', 'ellan', 'ellanalyticrank', 'ellap', 'ellbil',
        'ellcard', 'ellchangecurve', 'ellchangepoint', 'ellchangepointinv', 'ellconvertname',
        'elldivpol', 'elleisnum', 'elleta', 'ellformaldifferential', 'ellformalexp', 'ellformallog',
        'ellformalpoint', 'ellformalw', 'ellfromeqn', 'ellfromj', 'ellgenerators', 'ellglobalred',
        'ellgroup', 'ellheegner', 'ellheight', 'ellheightmatrix', 'ellidentify', 'ellinit',
        'ellintegralmodel', 'ellisdivisible', 'ellisogeny', 'ellisogenyapply', 'ellisomat',
        'ellisoncurve', 'ellissupersingular', 'ellj', 'elllocalred', 'elllog', 'elllseries',
        'ellminimalmodel', 'ellminimaltwist', 'ellmoddegree', 'ellmodulareqn', 'ellmul',
        'ellneg', 'ellnonsingularmultiple', 'ellorder', 'ellordinate', 'ellpadicL', 'ellpadicfrobenius',
        'ellpadicheight', 'ellpadicheightmatrix', 'ellpadiclog', 'ellpadics2', 'ellperiods',
        'ellpointtoz', 'ellpow', 'ellrootno', 'ellsea', 'ellsearch', 'ellsigma', 'ellsub',
        'elltaniyama', 'elltatepairing', 'elltors', 'elltwist', 'ellweilpairing', 'ellwp',
        'ellxn', 'ellzeta', 'ellztopoint', 'erfc', 'errname', 'error', 'eta', 'eulerphi',
        'eval', 'exp', 'expm1', 'extern', 'externstr', 'factor', 'factorback', 'factorcantor',
        'factorff', 'factorial', 'factorint', 'factormod', 'factornf', 'factorpadic', 'ffgen',
        'ffinit', 'fflog', 'ffnbirred', 'fforder', 'ffprimroot', 'fibonacci', 'floor', 'fold',
        'for', 'forcomposite', 'fordiv', 'forell', 'forpart', 'forprime', 'forqfvec', 'forstep',
        'forsubgroup', 'forvec', 'frac', 'fromdigits', 'galoisexport', 'galoisfixedfield',
        'galoisgetpol', 'galoisidentify', 'galoisinit', 'galoisisabelian', 'galoisisnormal',
        'galoispermtopol', 'galoissubcyclo', 'galoissubfields', 'galoissubgroups', 'gamma',
        'gammah', 'gammamellininv', 'gammamellininvasymp', 'gammamellininvinit', 'gcd',
        'gcdext', 'genus2red', 'getabstime', 'getenv', 'getheap', 'getrand', 'getstack',
        'gettime', 'getwalltime', 'global', 'hammingweight', 'hilbert', 'hyperellcharpoly',
        'hyperellpadicfrobenius', 'hyperu', 'idealadd', 'idealaddtoone', 'idealappr', 'idealchinese',
        'idealcoprime', 'idealdiv', 'idealfactor', 'idealfactorback', 'idealfrobenius',
        'idealhnf', 'idealintersect', 'idealinv', 'ideallist', 'ideallistarch', 'ideallog',
        'idealmin', 'idealmul', 'idealnorm', 'idealnumden', 'idealpow', 'idealprimedec',
        'idealprincipalunits', 'idealramgroups', 'idealred', 'idealstar', 'idealtwoelt',
        'idealval', 'if', 'iferr', 'imag', 'incgam', 'incgamc', 'inline', 'input', 'install',
        'intcirc', 'intformal', 'intfuncinit', 'intnum', 'intnumgauss', 'intnumgaussinit',
        'intnuminit', 'intnumromb', 'isfundamental', 'ispolygonal', 'ispower', 'ispowerful',
        'isprime', 'isprimepower', 'ispseudoprime', 'ispseudoprimepower', 'issquare', 'issquarefree',
        'istotient', 'kill', 'kronecker', 'lambertw', 'lcm', 'length', 'lex', 'lfun', 'lfunabelianrelinit',
        'lfunan', 'lfunartin', 'lfuncheckfeq', 'lfunconductor', 'lfuncost', 'lfuncreate',
        'lfundiv', 'lfunetaquo', 'lfungenus2', 'lfunhardy', 'lfuninit', 'lfunlambda', 'lfunmfspec',
        'lfunmul', 'lfunorderzero', 'lfunqf', 'lfunrootres', 'lfuntheta', 'lfunthetacost',
        'lfunthetainit', 'lfunzeros', 'lift', 'liftall', 'liftint', 'liftpol', 'limitnum',
        'lindep', 'listcreate', 'listinsert', 'listkill', 'listpop', 'listput', 'listsort',
        'lngamma', 'local', 'localbitprec', 'localprec', 'log', 'logint', 'mapdelete', 'mapget',
        'mapisdefined', 'mapput', 'matadjoint', 'matalgtobasis', 'matbasistoalg', 'matcompanion',
        'matconcat', 'matdet', 'matdetint', 'matdiagonal', 'mateigen', 'matfrobenius', 'mathess',
        'mathilbert', 'mathnf', 'mathnfmod', 'mathnfmodid', 'mathouseholder', 'matid', 'matimage',
        'matimagecompl', 'matindexrank', 'matintersect', 'matinverseimage', 'matisdiagonal',
        'matker', 'matkerint', 'matmuldiagonal', 'matmultodiagonal', 'matpascal', 'matqr',
        'matrank', 'matrix', 'matrixqz', 'matsize', 'matsnf', 'matsolve', 'matsolvemod',
        'matsupplement', 'mattranspose', 'max', 'min', 'minpoly', 'modreverse', 'moebius',
        'msatkinlehner', 'mscuspidal', 'mseisenstein', 'mseval', 'msfromcusp', 'msfromell',
        'msfromhecke', 'msgetlevel', 'msgetsign', 'msgetweight', 'mshecke', 'msinit', 'msissymbol',
        'msnew', 'msomseval', 'mspadicL', 'mspadicinit', 'mspadicmoments', 'mspadicseries',
        'mspathgens', 'mspathlog', 'msqexpansion', 'mssplit', 'msstar', 'mstooms', 'my',
        'newtonpoly', 'next', 'nextprime', 'nfalgtobasis', 'nfbasis', 'nfbasistoalg', 'nfcertify',
        'nfcompositum', 'nfdetint', 'nfdisc', 'nfeltadd', 'nfeltdiv', 'nfeltdiveuc', 'nfeltdivmodpr',
        'nfeltdivrem', 'nfeltmod', 'nfeltmul', 'nfeltmulmodpr', 'nfeltnorm', 'nfeltpow',
        'nfeltpowmodpr', 'nfeltreduce', 'nfeltreducemodpr', 'nfelttrace', 'nfeltval', 'nffactor',
        'nffactorback', 'nffactormod', 'nfgaloisapply', 'nfgaloisconj', 'nfgrunwaldwang',
        'nfhilbert', 'nfhnf', 'nfhnfmod', 'nfinit', 'nfisideal', 'nfisincl', 'nfisisom',
        'nfislocalpower', 'nfkermodpr', 'nfmodpr', 'nfmodprinit', 'nfmodprlift', 'nfnewprec',
        'nfroots', 'nfrootsof1', 'nfsnf', 'nfsolvemodpr', 'nfsplitting', 'nfsubfields',
        'norm', 'norml2', 'normlp', 'numbpart', 'numdiv', 'numerator', 'numtoperm', 'omega',
        'oo', 'padicappr', 'padicfields', 'padicprec', 'parapply', 'pareval', 'parfor',
        'parforprime', 'parforvec', 'parselect', 'parsum', 'partitions', 'parvector', 'permtonum',
        'plot', 'polchebyshev', 'polclass', 'polcoeff', 'polcompositum', 'polcyclo', 'polcyclofactors',
        'poldegree', 'poldisc', 'poldiscreduced', 'polgalois', 'polgraeffe', 'polhensellift',
        'polhermite', 'polinterpolate', 'poliscyclo', 'poliscycloprod', 'polisirreducible',
        'pollead', 'pollegendre', 'polmodular', 'polrecip', 'polred', 'polredabs', 'polredbest',
        'polredord', 'polresultant', 'polresultantext', 'polroots', 'polrootsff', 'polrootsmod',
        'polrootspadic', 'polrootsreal', 'polsturm', 'polsubcyclo', 'polsylvestermatrix',
        'polsym', 'poltchebi', 'poltschirnhaus', 'polylog', 'polzagier', 'powers', 'precision',
        'precprime', 'prime', 'primepi', 'primes', 'print', 'print1', 'printf', 'printsep',
        'printsep1', 'printtex', 'prod', 'prodeuler', 'prodinf', 'psi', 'qfauto', 'qfautoexport',
        'qfbclassno', 'qfbcompraw', 'qfbhclassno', 'qfbil', 'qfbnucomp', 'qfbnupow', 'qfbpowraw',
        'qfbprimeform', 'qfbred', 'qfbredsl2', 'qfbsolve', 'qfeval', 'qfgaussred', 'qfisom',
        'qfisominit', 'qfjacobi', 'qflll', 'qflllgram', 'qfminim', 'qfnorm', 'qforbits',
        'qfparam', 'qfperfection', 'qfrep', 'qfsign', 'qfsolve', 'quadclassunit', 'quaddisc',
        'quadgen', 'quadhilbert', 'quadpoly', 'quadray', 'quadregulator', 'quadunit', 'ramanujantau',
        'random', 'randomprime', 'read', 'readstr', 'readvec', 'real', 'removeprimes', 'return',
        'rnfalgtobasis', 'rnfbasis', 'rnfbasistoalg', 'rnfcharpoly', 'rnfconductor', 'rnfdedekind',
        'rnfdet', 'rnfdisc', 'rnfeltabstorel', 'rnfeltdown', 'rnfeltnorm', 'rnfeltreltoabs',
        'rnfelttrace', 'rnfeltup', 'rnfequation', 'rnfhnfbasis', 'rnfidealabstorel', 'rnfidealdown',
        'rnfidealfactor', 'rnfidealhnf', 'rnfidealmul', 'rnfidealnormabs', 'rnfidealnormrel',
        'rnfidealprimedec', 'rnfidealreltoabs', 'rnfidealtwoelt', 'rnfidealup', 'rnfinit',
        'rnfisabelian', 'rnfisfree', 'rnfislocalcyclo', 'rnfisnorm', 'rnfisnorminit', 'rnfkummer',
        'rnflllgram', 'rnfnormgroup', 'rnfpolred', 'rnfpolredabs', 'rnfpolredbest', 'rnfpseudobasis',
        'rnfsteinitz', 'round', 'select', 'self', 'seralgdep', 'serconvol', 'serlaplace',
        'serprec', 'serreverse', 'setbinop', 'setintersect', 'setisset', 'setminus', 'setrand',
        'setsearch', 'setunion', 'shift', 'shiftmul', 'sigma', 'sign', 'simplify', 'sin',
        'sinc', 'sinh', 'sizebyte', 'sizedigit', 'solve', 'solvestep', 'sqr', 'sqrt', 'sqrtint',
        'sqrtn', 'sqrtnint', 'stirling', 'subgrouplist', 'subst', 'substpol', 'substvec',
        'sum', 'sumalt', 'sumdedekind', 'sumdigits', 'sumdiv', 'sumdivmult', 'sumformal',
        'suminf', 'sumnum', 'sumnuminit', 'sumnummonien', 'sumnummonieninit', 'sumpos',
        'system', 'tan', 'tanh', 'taylor', 'teichmuller', 'theta', 'thetanullk', 'thue',
        'thueinit', 'trace', 'trap', 'truncate', 'type', 'uninline', 'until', 'valuation',
        'varhigher', 'variable', 'variables', 'varlower', 'vecextract', 'vecmax', 'vecmin',
        'vecsearch', 'vecsort', 'vecsum', 'vector', 'vectorsmall', 'vectorv', 'version',
        'warning', 'weber', 'while', 'write', 'write1', 'writebin', 'writetex', 'zeta',
        'zetamult', 'zncharinduce', 'zncharisodd', 'znchartokronecker', 'znconreychar',
        'znconreyconductor', 'znconreyexp', 'znconreylog', 'zncoppersmith', 'znlog', 'znorder']);

  var all = /(?:.)/;
  var comment = /(?:\\\\.*)/;
  var literals = /(?:")/;
  var numbers = /(?:\d*\.?\d+(?![\w@\\]))/;

  CodeMirror.defineSimpleMode('gp', {
    start: [
      {regex: comment, token: 'comment'},
      {regex: /\/\*/, token: 'comment', next: 'comment'},
      {regex: literals, token: 'string', next: 'string'},
      {regex: builtin, token: 'keyword'},
      {regex: numbers, token: 'number'},
      {regex: all, token: null}
    ],
    string: [
      {regex: /(?:[^\\"']|\\.)*?"/, token: 'string', next: 'start'},
      {regex: /.*/, token: 'string'}
    ],
    // The multi-line comment state.
    comment: [
      {regex: /.*?\*\//, token: "comment", next: "start"},
      {regex: /.*/, token: "comment"}
    ],
    meta: {lineComment: '\\\\', electricInput: all, dontIndentStates: ['comment']}


  })

  CodeMirror.defineMIME('text/x-pari-gp', 'gp');

});
