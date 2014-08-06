Error Stack Filter
==================

Filter Stack Traces from not useful files, like remove all `node_modules` files from trace


Usage
=====

* `npm install error-stack-filter`
* `var ErrorStackFilter = require('error-stack-filter');`
* create new instance: `new ErrorStackFilter([], 20)`


class ErrorStackFilter
--

+ constructor (IGNORE_FILES, STACK_LIMIT);

where IGNORE_FILES must contain strings or RegExps.
Strings are matched from zero index and for RegExps, test should be true.

Example
-
`new ErrorStackFilter([path.resolve(__dirname, '/some_file.js'), /\/node_modules\//], 10);`
this will filter paths where node_modules exist and file `__dirname/some_file.js`