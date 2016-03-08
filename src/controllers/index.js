module.exports = {
  createSearch: require('./createSearchCtlr'),
  createCitation: require('./createCitationCtlr'),

  search: function() {
    console.error('ncbi.search is deprecated with no alternative available. Use createSearch to get a search controller instead.');
  },

  getAbstract: function() {
    console.error('ncbi.getAbstract is deprecated with no alternative available. Use createCitation to get a citation controller instead.');
  }
}
