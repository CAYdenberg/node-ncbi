/* eslint-env mocha, node */

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

var createGateway = require('../src/gateways');
describe('Search Gateway', function() {

  var search = createGateway.pubmedSearch('ydenberg ca', 0, 10);
  describe('generateUrl search', function() {
    it('should build a valid search url from parameters', function() {
      assert.equal(search.generateUrl(), 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?retmode=json&db=pubmed&term=ydenberg%20ca&retstart=0&retmax=10');
    });
  });

});

describe('Links gateway', function() {

  describe('generateUrl links', function() {
    var links = createGateway.pubmedLinks(22588722);
    it('should build a valid link url from parameters', function() {
      assert.equal(links.generateUrl(), 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?retmode=json&db=pubmed&dbfrom=pubmed&cmd=neighbor&id=22588722');
    });
  });

});

const parse = require('../src/gateways/parse');
function getDoc(filename, callback) {

  var fs = require('fs');
  var path = require('path');
  fs.readFile(path.join(__dirname, 'docs', filename), 'UTF-8', (err, data) => {
    callback(err, parse(data));
  });
}

var q = require('../src/queries');
describe('parser', function() {

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
        assert.equal(q.summaries(contents).length, 9);
        done();
      });
    });
  });

  describe('abstract', function() {
    it('should retrieve the abstract from an xml string', function(done) {
      getDoc('fetch.xml', function(err, contents) {
        assert.ok(q.abstract(contents));
        done();
      });
    });
  });

  describe('citedBy', function() {
    it('should find all of the papers that have cited this one', function(done) {
      getDoc('elink.json', function(err, contents) {
        assert.equal(q.citedBy(contents).length, 2);
        done();
      });
    })
  });

  describe('cites', function() {
    it('should find all the papers this paper cites', function(done) {
      getDoc('elink.json', function(err, contents) {
        assert.ok(q.cites(contents));
        done();
      });
    });
  });

  describe('similar', function() {
    it('should find all the papers PubMed flags as similar to this one', function(done) {
      getDoc('elink.json', function(err, contents) {
        assert.ok(q.similar(contents));
        done();
      });
    });
  });

});
