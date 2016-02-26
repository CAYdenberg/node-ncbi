var _ = require('underscore');

var ESummaryDocument = require('./document');

/**
 * Return an array of record summaries. Return the ENTIRE record in each case.
 * @arg single | Boolean - if true, the return just one record instead of an array
 */
ESummaryDocument.summaries = function(single) {
  var results;
  try {
    results = this.record.result;
  } catch(e) {
    return null;
  }
  var summaryArr = _.map(results, function(summary, key) {
    //papers are indexed by their uid.
    if ( parseInt(key, 10) ) {
      return summary;
    } else {
      return false;
    }
  });
  var curatedArr = _.without(summaryArr, false);
  return this.getStringOrArray(curatedArr, single);
}

module.exports = ESummaryDocument;
