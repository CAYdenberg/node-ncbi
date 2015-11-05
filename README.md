#node-ncbi#

A nodejs wrapper for the NCBI eUtils API. You can use it to search PubMed or other databases and get the results as a JavaScript object.

[Read the full documentation of the API](http://www.ncbi.nlm.nih.gov/books/NBK25500/).

## Getting started

`npm install --save node-ncbi`

`var ncbi = require('node-ncbi');`

## Basic usage

```js
ncbi.pubmedSearch('actin').then(function(results) {
    console.log(results);
})
```

Will display `{count: 101882, papers: {...}}`

```js
ncbi.getAbstract(6365930, true).then(function(result) {
    console.log(result);
});
```
will display the abstract, where 6365930 is a PubMed ID number, a true indicates that only a single result is expected.

## Advanced usage

node-ncbi consists of three components: a gateway, a parser, and a few functions that wrap around them to create simple interfaces.

### Gateway

```js
var gateway = require('node-ncbi/createGateway')({
    method: 'esearch',
    responseType: 'json',
    params: {
        term: 'actin'
    },
    test: false
});
```

`method` may be esearch, esummary, efetch, etc.

`responseType` may be json or xml. Note that efetch only returns XML.

Params can be [any of the parameters that the eUtils API accepts](http://www.ncbi.nlm.nih.gov/books/NBK25500/), as key-value pairs.

**Methods**

`gateway.addParams({parameterKey: parameterValue})` - add new parameters after instantiating the object.

`gateway.addIds(ids)` - special way to add a list of IDs as a parameter; an array of ids will be concatenated into a string.

`gateway.send().then(function(response) {...})` - send off the request. The entire, unfiltered response will be the first argument of the callback passed to `then`.

`gateway.get().then(function(doc) {...})` - send of the request and created a parser object. The parser object will be the first argument of the callback passed to `then`.

###Parser###

```js
var doc = require('node-ncbi/createNcbiDataDocument')(data);
```

Data may be JSON or XML (or a JavaScript object). It will stored in the property `doc.record`.

**Methods**

`doc.count()` - return the count (total results) from a search.

`doc.ids()` - return all IDs (such as PubMed ID numbers) from a search.

`doc.summaries(single)` - return the complete record of each summary found in an esummary search. If *single* is false, return an array, otherwise a single object.

`doc.abstracts(single)` - return the abstract from one or more results, as a string. If *single* is false, return an array, otherwise a single string.

### License

Copyright (c) 2015 Casey A. Ydenberg

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
