/* eslint-env mocha, node */

const check = require('check-types').assert;
const {getDoc, isPubmedSummary} = require('./helpers');
const assert = require('assert');

/**
 * PARSERS
 *
 */

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

  describe('isOa', () => {
    it('should tell us if a PMC document is fully open-access', (done) => {
      getDoc('pmc_oa.xml', (err, contents) => {
        assert.equal(q.isOa(contents), true);
        done()
      });
    });
    it('should tell us if a PMC document is not open-access', (done) => {
      getDoc('pmc_not_oa.xml', (err, contents) => {
        assert.equal(q.isOa(contents), false);
        done()
      });
    })
  });

});
