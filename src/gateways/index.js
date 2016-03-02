"use strict";

const createGateway = require('./createGateway');

module.exports = {

  pubmedSearch: function(query, start, end) {
    return createGateway({
      documentType : 'esearch',
      params : {
        db : 'pubmed',
        term : query,
        retstart : start,
        retmax : end - start
      }
    });
  },

  pubmedSummary: function(ids) {
    let gateway = createGateway({
      documentType : 'esummary',
      params : {
        db : 'pubmed'
      }
    });
    gateway.addIds(ids);
    return gateway;
  },

  abstract: function(ids) {
    let gateway = createGateway({
      documentType : 'efetch',
      responseType : 'xml',
      params : {
        db : 'pubmed'
      }
    });
    gateway.addIds(ids);
    return gateway;
  },

  pubmedLinks: function(id) {
    let gateway = createGateway({
      documentType : 'elink',
      params : {
        db : 'pubmed',
        dbfrom: 'pubmed',
        cmd: 'neighbor'
      }
    });
    gateway.addIds(id);
    return gateway;
  }

}
