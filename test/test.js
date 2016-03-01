/*eslint-env mocha */

//test the tests
var assert = require("assert")
describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    })
  })
})


const createGateway = require('../src/gateways');
describe('Search Gateway', function() {

  describe('generateUrl search', function() {
    var search = createGateway.pubmedSearch('ydenberg ca', 0, 10);
    it('should build a valid search url from parameters', function() {
      assert.equal(search.generateUrl(), 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=ydenberg%20ca&retstart=0&retmax=10&retmode=json');
    });
  });

});

describe('Links gateway', function() {

  describe('generateUrl links', function() {
    var links = createGateway.pubmedLinks();
    links.addIds(22588722);
    it('should build a valid link url from parameters', function() {
      assert.equal(links.generateUrl(), 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?db=pubmed&dbfrom=pubmed&cmd=neighbor&retmode=json&id=22588722');
    });
  });

});

function getDoc(filename, callback) {
  var fs = require('fs');
  var path = require('path');
  fs.readFile(path.join(__dirname, 'docs', filename), 'UTF-8', callback);
}

var createParser = require('../src/documents');
describe('parser', function() {

  describe('count', function() {
    it('should find the count field in a JSON search result', function(done) {
      getDoc('search.json', function(err, contents) {
        var parser = createParser(contents, 'esearch');
        assert.equal(parser.count(), 9);
        done();
      });
    });
  });

  describe('ids', function() {
    it('should return an array of ids', function(done) {
      getDoc('search.json', function(err, contents) {
        var parser = createParser(contents, 'esearch');
        assert.equal(parser.ids().length, 9);
        done();
      })
    });
  });

  describe('summary', function() {
    it('should find all of the info for each summary in the result set', function(done) {
      getDoc('summary.json', function(err, contents) {
        var parser = createParser(contents, 'esummary');
        var summaries = parser.summaries();
        assert.equal(summaries.length, 9);
        done();
      });
    });
  });

  describe('abstract', function() {
    it('should retrieve the abstract from an xml string', function(done) {
      getDoc('fetch.xml', function(err, contents) {
        var parser = createParser(contents, 'efetch');
        assert.ok( parser.abstracts(true) );
        done();
      });
    });
  });

  describe('citedBy', function() {
    it('should find all of the papers that have cited this one', function(done) {
      getDoc('elink.json', function(err, contents) {
        var parser = createParser(contents, 'elink');
        assert.equal(parser.citedBy().length, 2);
        done();
      });
    })
  });

  describe('cites', function() {
    it('should find all the papers this paper cites', function(done) {
      getDoc('elink.json', function(err, contents) {
        var parser = createParser(contents, 'elink');
        assert.ok(parser.cites());
        done();
      });
    });
  });

  describe('similar', function() {
    it('should find all the papers PubMed flags as similar to this one', function(done) {
      getDoc('elink.json', function(err, contents) {
        var parser = createParser(contents, 'elink');
        assert.ok(parser.similar());
        done();
      });
    });
  });

});
