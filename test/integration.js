/* eslint-env mocha, node */

const check = require('check-types').assert;
const {isPubmedSummary} = require('./helpers.js');
const assert = require('assert');

var pubmed = require('../src/pubmed');

describe('Pubmed module', function() {
  this.timeout(10000);

  it('should perform a search', function(done) {
    pubmed.search('ydenberg ca').then(results => {
      results.papers.forEach(isPubmedSummary);
      done();
    })
  });

  it('should return a count of 0 if the search returns no results', function(done) {
    pubmed.search('boioioioioioioioioioioing').then(results => {
      assert.equal(results.count, 0);
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

  it('should tell us if a paper is open access', function(done) {
    pubmed.isOa(22323294).then(result => {
      assert.equal(result, true);
      done();
    })
  });

  it('should tell us if a paper is not open access', function(done) {
    pubmed.isOa(23727094).then(result => {
      assert.equal(result, false);
      done();
    });
  });

  it('should retrieve the full NLM XML of a paper', function(done) {
    pubmed.fulltext(22323294).then(result => {
      check.string(result);
      done();
    });
  });

});
