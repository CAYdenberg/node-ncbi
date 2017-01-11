'use strict';

const gateways = require('./gateways');
const queries = require('./queries');

module.exports = {

  search: function(query, page, resultsPerPage) {
    let count;
    page = page || 0;
    resultsPerPage = resultsPerPage || 10;
    return gateways.pubmedSearch(query, page, resultsPerPage).resolve(data => {
      count = queries.count(data);
      const pmids = queries.ids(data);
      if (!pmids.length) {
        return {
          count: 0,
          papers: []
        };
      }
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
      var pmids = queries.findLinks('pubmed_pubmed_citedin', data);
      if (!pmids.length) return [];
      return this.summaries(pmids);
    });
  },

  cites: function(pmid) {
    return gateways.pubmedLinks(pmid).resolve(data => {
      var pmids = queries.findLinks('pubmed_pubmed_refs', data);
      if (!pmids.length) return [];
      return this.summaries(pmids);
    });
  },

  similar: function(pmid) {
    return gateways.pubmedLinks(pmid).resolve(data => {
      var pmids = queries.findLinks('pubmed_pubmed', data);
      if (!pmids.length) return [];
      return this.summaries(pmids);
    });
  },

  abstract: function(pmid) {
    return gateways.pubmedRecord(pmid).resolve(queries.abstract);
  },

  isOa: function(pmid) {
    return this.summary(pmid).then(summary => {
      if (!summary) {
        return null;
      } else {
        const pmcid = summary.pmc;
        return gateways.pmcFullText(pmcid).resolve(queries.isOa);
      }
    });
  },

  fulltext: function(pmid) {
    return this.summary(pmid).then(summary => {
      if (!summary) {
        return null;
      } else {
        const pmcid = summary.pmc;
        return gateways.pmcFullText(pmcid).send().then(res => res.body);
      }
    });
  }

}
