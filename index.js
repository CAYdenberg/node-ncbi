'use strict';

module.exports = {
  pubmed: require('./src/pubmed'),

  createSearch: function() {
    console.error('createSearch has been deprecated. Please use the pure function `ncbi.pubmed.search` instead.');
  },

  createCitation: function() {
    console.error('createCitation has been deprecated. Please use pure functions instead (see documentation)');
  }
}
