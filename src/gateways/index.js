const createGateway = require('./createGateway');

module.exports = {

  pubmedSearch: function(query, start, end) {
    return createGateway({
      method : 'esearch',
      params : {
        db : 'pubmed',
        term : query,
        retstart : start,
        retmax : end - start
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
  },

  pubmedLinks: function() {
    return createGateway({
      method : 'elink',
      params : {
        db : 'pubmed',
        dbfrom: 'pubmed',
        cmd: 'neighbor'
      }
    });
  }

}
