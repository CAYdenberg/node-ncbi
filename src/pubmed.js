'use strict';

const gateways = require('../gateways');
const queries = require('../queries');

module.exports = {

  search: function(query, page, resultsPerPage) {
    let count;
    page = page || 0;
    resultsPerPage = resultsPerPage || 10;
    return gateways.pubmedSearch(query, page, resultsPerPage).resolve(data => {
      count = queries.count(data);
      const pmids = queries.ids(data);
      return new Promise((resolve, reject) => {
        this.summaries(pmids).then(summaries => {
          resolve({
            count: count,
            papers: summaries
          });
        }).catch(err => reject(err));
      });
    });
  },

  summaries: function(pmids) {
    return gateways.pubmedSummary(pmids).resolve(queries.summaries);
  },

  summary: function(pmid) {
    return gateways.pubmedSummary(pmid).resolve(data => {
      const summaries = queries.summaries(data);
      if (summaries.length) {
        return summaries[0];
      } else {
        return null;
      }
    });
  },

  citedBy: function(pmid) {
    return gateways.pubmedLinks(pmid).resolve(data => {
      return queries.findLinks('pubmed_pubmed_citedin', data);
    });
  },

  cites: function(pmid) {
    return gateways.pubmedLinks(pmid).resolve(data => {
      return queries.findLinks('pubmed_pubmed_refs', data);
    });
  },

  similar: function(pmid) {
    return gateways.pubmedLinks(pmid).resolve(data => {
      return queries.findLinks('pubmed_pubmed', data);
    });
  },

  abstract: function(pmid) {
    return gateways.pubmedRecord(pmid).resolve(queries.abstract);
  }

}
