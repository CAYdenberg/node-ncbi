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


var createGateway = require('../createGateway');
describe('Gateway', function() {

  var search = createGateway({
    method : 'esearch',
    params : {
      db : 'pubmed',
      term : 'ydenberg ca'
    },
    test : true
  });
  describe('generateUrl', function() {
    it('should build a valid search url from parameters', function() {
      assert.equal(search.generateUrl(), 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=ydenberg%20ca&retmode=json');
    });
  });

});

function getDoc(filename, callback) {
  fs = require('fs');
  path = require('path');
  fs.readFile(path.join(__dirname, 'docs', filename), 'UTF-8', callback);
}

var createParser = require('../createNcbiDataDocument');
describe('parser', function() {

  describe('count', function() {
    it('should find the count field in a JSON search result', function(done) {
      getDoc('search.json', function(err, contents) {
        var parser = createParser(contents);
        assert.equal(parser.count(), 9);
        done();
      });
    });
  });

  describe('ids', function() {
    it('should return an array of ids', function(done) {
      getDoc('search.json', function(err, contents) {
        var parser = createParser(contents);
        assert.equal(parser.ids().length, 9);
        done();
      })
    });
  });

  describe('summary', function() {
    it('should find all of the info for each summary in the result set', function(done) {
      getDoc('summary.json', function(err, contents) {
        var parser = createParser(contents);
        var summaries = parser.summaries();
        assert.equal(summaries.length, 9);
        done();
      });
    });
  });

  describe('abstract', function() {
    it('should retrieve the abstract from an xml string', function(done) {
      getDoc('fetch.xml', function(err, contents) {
        var parser = createParser(contents);
        assert.ok( parser.abstract(true) );
        done();
      });
    });
  });

});
