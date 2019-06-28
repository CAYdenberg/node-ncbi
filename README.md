# node-ncbi

A nodejs wrapper for the NCBI eUtils. You can use it to search PubMed or other databases and get the results as a JavaScript object.

[Read the full documentation of eUtils](http://www.ncbi.nlm.nih.gov/books/NBK25500/).

## Getting started

`npm install --save node-ncbi`

`var ncbi = require('node-ncbi');`

### API Keys

eUtils now requires API keys to make **more than three requests per second** [You can read here about how to obtain an API key from NCBI](https://www.ncbi.nlm.nih.gov/books/NBK25497/#chapter2.Coming_in_December_2018_API_Key).

Starting with v0.6.0 of `node-ncbi`, setting the environment variable `NCBI_API_KEY` will automatically append your key to all outgoing requests.

## Basic usage

### Performing a search

```js
const pubmed = ncbi.pubmed;
pubmed.search('actin').then((results) => {
    console.log(results);
});
```

Will log

```
{
  count: (Number),
  papers: [
    raw: (Pubmed Summary object),
    pubDate: (String),
    title: (String),
    authors: (String),
    pmid: (Integer),
    pmc: (Integer if available),
    doi: (String if available)
  ]
}
```

where `count` is the total number of papers, independent of pagination. The "papers" represent PubMed "summaries" containing title, authors, journal and citation information, etc..

By default, 10 results will be retrieved at a time. To get the next set of results:

```javascript
pubmed.search('actin', 1).then((results) => {
    console.log(results);
});
```

To change the number of results retrieved at a time:

```javascript
pubmed.search('actin', 0, 20).then((results) => {
    console.log(results);
});
```

###Looking up a specific paper

```javascript
pubmed.summary(20517925).then((paper) => {
  console.log(paper);
});
```

where the only argument is a PMID (PubMed ID #).

In addition, following methods are available:

- `abstract()` - get the abstract
- `summary()` - get the "summary" - an object of fields containing title, authors, citation info, etc.
- `cites()`  - papers which this paper cites.
- `citedBy()` - papers which cite this paper (only includes citing papers in PubMed central)
- `similar()` - papers similar to this one (similarity is calculated on NCBI's side of the API, not ours).
- `isOa()` - true if the full NLM XML can be retrieved ("Gold" open-access)
- `fulltext()` - the full NLM XML if available, null otherwise

All methods return a promise accessible by `.then()`; the value retrieved is passed to the promise.

## Contributing

I'd love to get PRs improving the code or expanding the search methods beyond PubMed.

You can build for development by navigating to the project folder and running `npm install`. You'll also need to have gulp installed globally `npm install -g gulp`.

### REPL

To help with creating Gateways are seeing the data structures returned by the API, node-ncbi provides a custom REPL. Start it with `npm start`. You can then run `url({object})` or `open({object})` where {object} is an object literal that looks like the following:

```javascript
utility: 'esearch',
params: {
  db: 'pubmed',
  term: query,
  retstart: start,
  retmax: resultsPerPage
}
```

 `url` will log the URL needed to access eUtils while `open` will open that URL in a browser. This can help with debugging and to look at the actual data which is useful to create new queries. [See the full documentation of eUtils](http://www.ncbi.nlm.nih.gov/books/NBK25500/) for more information on creating
 queries.

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
