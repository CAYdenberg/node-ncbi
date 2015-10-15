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


var Gateway = require('../Gateway');
describe('Gateway', function() {

  var search = new Gateway({
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

var parser = require('../parser');
describe('parser', function() {

  describe('count', function() {
    it('should find the count field in a JSON search result', function(done) {
      getDoc('search.json', function(err, contents) {
        assert.equal(parser.count(contents), 9);
        done();
      });
    });
    it('should find the count field in an XML search result', function(done) {
      getDoc('search.xml', function(err, contents) {
        assert.equal(parser.count(contents), 9);
        done();
      });
    });
  });

  // describe('ids', function() {
  //   it('should return an array of ids', function() {
  //     assert.equal(parser.ids(json).length, 9);
  //   });
  // });
  //
  // describe('abstract', function() {
  //   it('should retrieve the abstract from an xml string', function() {
  //     assert.ok( parser.abstract(xml, true) );
  //   });
  // });

});

//
//
// var actions = require('../lib/NCBI/ncbi.js');
// describe('ncbi', function() {
//
//   var pubmedSearch = actions.pubmedSearch;
//   describe('pubmedSearch', function() {
//     it('should search pubmed', function(done) {
//       var result = pubmedSearch('rose md', {resultsPerPage : 10}).then(function(res) {
//         assert.equal(res.papers.length, 10);
//         assert(res.total);
//         done();
//       });
//     });
//     it('should return an empty array if no results are found', function(done) {
//       var result = pubmedSearch('canucks flames').then(function(res) {
//         assert.equal(0, res.papers.length);
//         done();
//       });
//     });
//   });
//
//   var getAbstract = actions.getAbstract;
//   describe('getAbstract', function() {
//     it('should return the abstract from pubmed', function(done) {
//       getAbstract(26147656).then(function(data) {
//         assert.ok(data);
//         done();
//       });
//     });
//     it('should return multiple abstracts from pubmed', function(done) {
//       var result = getAbstract([25187651, 26147656]).then(function(data) {
//         assert.ok(data);
//         done();
//       });
//     });
//     it('should return null if bad pmid is sent', function(done) {
//       var result = getAbstract(0).then(function(data) {
//         assert.equal(0, data.length);
//         done();
//       });
//     });
//   });
//
// });
