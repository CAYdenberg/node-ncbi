/* eslint-env mocha, node */

const check = require('check-types').assert;

//test the tests
var assert = require('assert')
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function(){
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    })
  })
});

/**
 * GATEWAYS
 *
 * Testing ability of the gateways to form URLs from a set of parameters
 */
var createGateway = require('../src/gateways');
describe('Search Gateway', function() {

  var search = createGateway.pubmedSearch('ydenberg ca', 0, 10);
  describe('generateUrl search', function() {
    it('should build a valid search url from parameters', function() {
      assert.equal(search.generateUrl(), 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?retmode=json&db=pubmed&term=ydenberg%20ca&retstart=0&retmax=10');
    });
  });

});

describe('Links gateway', function() {

  describe('generateUrl links', function() {
    var links = createGateway.pubmedLinks(22588722);
    it('should build a valid link url from parameters', function() {
      assert.equal(links.generateUrl(), 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?retmode=json&db=pubmed&dbfrom=pubmed&cmd=neighbor&id=22588722');
    });
  });

});

describe('PMC full text gateway', () => {
  describe('generateUrl', () => {

    it('should build a valid url from parameters', () => {
      const fetch = createGateway.pmcFullText(3315798);
      assert.equal(fetch.generateUrl(), 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?retmode=xml&db=pmc&id=3315798');
    });

  });
});

/**
 * PARSERS
 *
 */

/**
 * Define helper functions to get JSON data as JavaScript so that we can
 * query it
 */
function getDoc(filename, callback) {
  const parse = require('../src/gateways/parse');
  var fs = require('fs');
  var path = require('path');
  fs.readFile(path.join(__dirname, 'docs', filename), 'UTF-8', (err, data) => {
    callback(err, parse(data));
  });
}

/** Define helper function to determine if an object is a pubmed summary */
function isPubmedSummary(obj) {
  check.number(obj.pmid);
  check.object(obj.raw);
  check.string(obj.title);
  check.string(obj.authors);
  check.emptyString(obj.abstract);
  check.string(obj.pubDate);
}


describe('Summary parser', function() {
  const sq = require('../src/queries/summaries');
  // Parser of a single summary

  describe('formatAuthors', function() {

    it('should return the article authors as a string', function() {
      const authors = [
        {name: 'Ydenberg CA'},
        {name: 'Johnstone A'}
      ]
      var result = sq.formatAuthors(authors);
      assert.equal('Ydenberg CA, Johnstone A', result);
    });

    it('should return an empty string in response to an empty array', function() {
      var result = sq.formatAuthors([])
      check.emptyString(result);
    });

  });

  describe('summary', function() {

    it('should return an object containing the important data at the top level and the entire summary embedded under the "raw" sub-object', function(done) {
      getDoc('summary_single.json', (err, contents) => {
        const result = sq.summary(contents);
        isPubmedSummary(result);
        done();
      })
    });

  });

  describe('sort', function() {

    it('should sort by reverse publication date order, by default', function(done) {
      const papers = [
        {pubDate: '1990'},
        {pubDate: '2010'},
        {pubDate: '2000'}
      ];
      const result = sq.sortSummaries(papers);
      assert.equal(result[0].pubDate, 2010);
      done();
    });
  });

});

describe('parser', function() {
  var q = require('../src/queries');

  describe('count', function() {
    it('should find the count field in a JSON search result', function(done) {
      getDoc('search.json', function(err, contents) {
        assert.equal(q.count(contents), 9);
        done();
      });
    });
  });

  describe('ids', function() {
    it('should return an array of ids', function(done) {
      getDoc('search.json', function(err, contents) {
        assert.equal(q.ids(contents).length, 9);
        done();
      })
    });
  });

  describe('summary', function() {
    it('should find all of the info for each summary in the result set', function(done) {
      getDoc('summary.json', function(err, contents) {
        q.summaries(contents).forEach(summary => {
          isPubmedSummary(summary);
        })
        done();
      });
    });
  });

  describe('abstract', function() {
    it('should retrieve the abstract from an xml string', function(done) {
      getDoc('fetch.xml', function(err, contents) {
        assert.equal(typeof q.abstract(contents), 'string');
        done();
      });
    });
  });

  describe('findLinks', function() {
    it('should find all of the papers that have cited this one', function(done) {
      getDoc('elink.json', function(err, contents) {
        assert.equal(q.findLinks('pubmed_pubmed_citedin', contents).length, 2);
        done();
      });
    })
  });

});



var pubmed = require('../src/pubmed');
describe('Pubmed module', function() {
  this.timeout(10000);

  it('should perform a search', function(done) {
    pubmed.search('ydenberg ca').then(results => {
      results.papers.forEach(isPubmedSummary);
      done();
    })
  });

  it('should return papers that cite this one', function(done) {
    pubmed.citedBy(19188495).then(results => {
      results.forEach(isPubmedSummary);
      done();
    });
  });

  it('should return papers that are similar to this one', function(done) {
    pubmed.similar(19188495).then(results => {
      results.forEach(isPubmedSummary);
      done();
    });
  });

  it('should return a count of 0 if the search returns no results', function(done) {
    pubmed.search('boioioioioioioioioioioing').then(results => {
      assert.equal(results.count, 0);
      done();
    })
  });

  it('should return null if an invalid pmid is passed', function(done) {
    pubmed.summary(0).then(results => {
      assert.equal(results, null);
      done();
    });
  });

  it('should return an empty array if an invalid pmid is passed to a linking method', function(done) {
    pubmed.citedBy(0).then(results => {
      assert.equal(results.length, 0);
      done();
    });
  });

  it('should return null if an invalid pmid is passed to the abstract method', function(done) {
    pubmed.abstract(0).then(results => {
      assert.equal(results, null);
      done();
    });
  });

});
