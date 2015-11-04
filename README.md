#node-ncbi#

A nodejs wrapper for the NCBI eUtils API. You can use to search PubMed or other databases and get the results as a JavaScript object.

[Read the full documentation of the API](http://www.ncbi.nlm.nih.gov/books/NBK25500/).

##Getting started##

`npm install node-ncbi`

`var ncbi = require('node-ncbi');`

##Basic usage##

```
ncbi.pubmedSearch('actin').then(function(results) {
    console.log(results);
})
```

Will display `{count: 101882, papers: {...}}`

```
ncbi.getAbstract(6365930, true).then(function(result) {
    console.log(result);
});
```
will display the abstract, where 6365930 is a PubMed ID number, a true indicates that only a single result is expected.

##Advanced usage##

node-ncbi consists of three components: a gateway, a parser, and a few functions that wrap around them to create simple interfaces.

###Gateway###

```
var gateway = require('node-ncbi/createGateway')({
    method: 'esearch',
    responseType: 'json',
    params: {
        term: 'actin'
    },
    test: false
});
```
(defaults are shown).

Method may be esearch, esummary, or efetch, etc.

Params can be any of the parameters that the eUtils API accepts.

Note that efetch only returns XML.

**Methods**

`gateway.addParams` - add new parameters after instatiating the object.

`gateway.addIds` - special way to add a list of IDs as a parameter; an array of ids will be concatenated into a string.

`gateway.send().then` - send off the request. The entire, unfiltered response will be the first argument of the callback passed to `then`.

`gateway.get().then` - send of the request and created a parser object. The parser object will be the first argument of the callback passed to `then`.

###Parser###

```
var doc = require('node-ncbi/createNcbiDataDocument')(data);
```

Data may be JSON or XML. It will stored in the property `doc.record`.

**Methods**

`doc.count()` - return the count (total results) from a search.

`doc.ids()` - return all IDs (such as PubMed ID numbers) from a search.

`doc.summaries(single)` - return the complete record of each summary found in an esummary search. If *single* is false, return an array, otherwise a single object.

`doc.abstracts(single)` - return the abstract from one or more results, as a string. If *single* is false, return an array, otherwise a single string.
