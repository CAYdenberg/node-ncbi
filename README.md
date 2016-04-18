# node-ncbi

A nodejs wrapper for the NCBI eUtils. You can use it to search PubMed or other databases and get the results as a JavaScript object.

[Read the full documentation of eUtils](http://www.ncbi.nlm.nih.gov/books/NBK25500/).

## Getting started

`npm install --save node-ncbi`

`var ncbi = require('node-ncbi');`

## Basic usage

### PubMed Searches

```js
let pubmedSearch = ncbi.createSearch('actin');
pubmedSearch.search().then((results) => {
    console.log(results);
});
```

Will log an array of objects. The objects represent PubMed "summaries" containing title, authors, journal and citation information, etc..

By default, 10 results will be retrieved at a time. To get the next set of results:

```js
pubmedSearch.getPage(1).then( ... );
```

**Note**: An earlier version used `pubmedSearch.nextPage` without an argument. I decided that storing this one tiny piece of state in the controller was stupid.

To change the number of results retrieved at a time:

```js
let pubmedSearch = ncbi.createSearch('actin', {
    resultsPerPage: 100
});
```

###Getting the details of a paper

```js
var paper = ncbi.createCitation(20517925);
```

where the only argument is a PMID (PubMed ID #).
The following methods are available:

- `abstract()` - get the abstract
- `summary()` - get the "summary" - an object of fields containing title, authors, citation info, etc.
- `cites()`  - papers which this paper cites.
- `citedBy()` - papers which cite this paper (only includes citing papers in PubMed central)
- `similar()` - papers similar to this one (similarity is calculated on NCBI's side of the API, not ours).

All methods return a promise accessible by `.then()`. Except for `.abstract()` the parameter passed to the callback is a PubMed summary or an array of summaries.

## Contributing

I'd love to get PRs improving the code or expanding the search methods beyond PubMed.

You can build for development by navigating to the project folder and running `npm install`. You'll also need to have gulp installed globally `npm install -g gulp`.

### Overview

The module consists of three main parts: a Gateway class that controls access to the API, a set of Document parsers for finding the required information in the returned documents, and Controllers for tying the two together.

Since many of the exposed methods require accessing the API multiple times (ie - perform a search and get ID numbers, then find the individual documents by sending those ID numbers) controllers configure as many gateways and parsers as needed to accomplish a particular task.

Gateways are instantiated with an object literal as follows:

```js
let gateway = Gateway({
    documentType: 'esearch' | 'esummary' | 'elink' | 'efetch' (default: 'esearch'),
    responseType: 'json' | 'xml' (default: 'json'),
    params: {} (set of parameters for the API)
    test: false
});
```

See the [API documentaion](http://www.ncbi.nlm.nih.gov/books/NBK25500/) for more information on document types and available parameters.

A set of PubMed IDs can be added like so:

```js
gateway.addIds([1111111, 2222222]);
```

The most important method is `gateway.send()` which returns a Promise resolving to the appropriate parser for the returned document type. The parser methods are pretty self-explanatory and are named for the type of information that they will return.

### REPL

To help with creating Gateways are seeing the data structures returned by the API, node-ncbi provides a custom REPL. Start it with `npm start`. You can then run `url({object})` or `open({object})` where {object} is an object literal for creating gateways as described above. `url` will log the URL needed to access eUtils while `open` will open that URL in a browser. This can help to see the actual data which is useful to create new parsers.

### Unit tests

The Gateway and the Parsers are tested independetly in `test/test.js`. Run with `gulp test`.

### ESLint

Run with `gulp lint`.


## License

Copyright (c) 2016 Casey A. Ydenberg

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
