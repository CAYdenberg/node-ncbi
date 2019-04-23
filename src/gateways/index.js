'use strict';

const createGateway = require('./createGateway');

/**
 * Wrapper factory functions for the Gateway. Create and configure Gateways
 * for a specific purpose.
 */
module.exports = {

  apiKey: '',

  /**
   * pubmedSearch. Return a Gateway for a pubmed search, with start and end parameters.
   * (ie first and last results.)
   */
  pubmedSearch: function(query, page, resultsPerPage, field = false) {
    const start = page * resultsPerPage;
    let obj = {
      utility: 'esearch',
      params: {
        db: 'pubmed',
        term: query,
        retstart: start,
        retmax: resultsPerPage,
        api_key: this.apiKey
      }
    }

    if( field ) {
      obj.params.field = field
    }

    return createGateway( obj );
  },

  /**
   * pubmedSummary. Get a set of pubmedSummaries, specified by an array of pmid (pubmed identifiers.)
   */
  pubmedSummary: function(ids) {
    return createGateway({
      utility: 'esummary',
      params: {
        db: 'pubmed',
        id: ids,
        api_key: this.apiKey
      }
    });
  },

  /**
  * Get a set of full/efetch documents from pubmed, specified by an array of pmids (pubmed identifiers).
  * Note that efetch documents can only be returned via XML (or flatfile).
  */
  pubmedRecord: function(ids) {
    return createGateway({
      utility: 'efetch',
      params: {
        db: 'pubmed',
        retmode: 'xml',
        id: ids,
        api_key: this.apiKey
      }
    });
  },

  /**
   * Get the elink set from pubmed, specified by a single unique pmid.
   * This document, retrieved using the neighbor command, contains link IDs for
   * similar articles, articles that cite this article, and articles cited by
   * this article.
   */
  pubmedLinks: function(id) {
    return createGateway({
      utility: 'elink',
      params: {
        db: 'pubmed',
        dbfrom: 'pubmed',
        cmd: 'neighbor',
        id: id,
        api_key: this.apiKey
      }
    });
  },

  pmcFullText: (id) => createGateway({
    utility: 'efetch',
    params: {
      db: 'pmc',
      retmode: 'xml',
      id: id,
      api_key: this.apiKey
    }
  })

}
