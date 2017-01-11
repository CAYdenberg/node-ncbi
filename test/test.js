/* eslint-env mocha, node */

//test the tests
var assert = require('assert');

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
