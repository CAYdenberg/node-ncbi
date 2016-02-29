var createGateway = require('./createGateway');

module.exports = {

  pubmedSearch: function(query, settings) {
    return createGateway({
      method : 'esearch',
      params : {
        db : 'pubmed',
        term : query,
        retstart : settings.start,
        retmax : settings.end - settings.start
      }
    });
  },

  pubmedSummary: function() {
    return createGateway({
      method : 'esummary',
      params : {
        db : 'pubmed'
      }
    });
  },

  abstract: function() {
    return createGateway({
      method : 'efetch',
      responseType : 'xml',
      params : {
        db : 'pubmed'
      }
    });
  }

}
