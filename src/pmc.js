'use strict';

const gateways = require('./gateways');
const queries = require('./queries');

module.exports = {
  summary: function(pmc) {
    return gateways.pmcSummary(pmc).resolve(data => {
      const summaries = queries.summaries(data);
      if (summaries.length) {
        return summaries[0];
      } else {
        return null;
      }
    });
  }
}