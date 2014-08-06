Error Stack Filter
==================

Filter Stack Traces from not useful files, like remove all `node_modules` files from trace


Usage
=====

* `npm install error-stack-filter`
* `var errorStackFilter = require('error-stack-filter');`
* returns singleton instance: `ErrorStackFilter([], 20);`


ErrorStackFilter ([ignoreFiles, [stackLimit ]])
--

+ setIgnoreFiles (Array ignoreFiles)
+ addIgnoreFiles (Array ignoreFiles) or addIgnoreFiles (ignoreFiles...)
+ removeIgnoreFiles (Array ignoreFiles) or removeIgnoreFiles (ignoreFiles)

Example
-
Error Stack Filter
==================

Filter Stack Traces from not useful files, like remove all `node_modules` files from trace

Example
-
```
  var errorStackFilter = require('error-stack-filter')();
  errorStackFilter.setIgnoreFiles([
    path.resolve(__dirname, '/some_file.js'),
    /\/node_modules\//
  ], 10);
````
this will filter paths where node_modules exist and file `__dirname/some_file.js`

