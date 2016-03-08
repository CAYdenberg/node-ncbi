const _ = require('underscore');
const createGateway = require('../gateways');

/**
 * Search Controller. Inisitalized with a query, then searches are executed
 * by calling a method to find specific pages.
 * @property: countVal | Integer - count values (total num of results) - set
 * the first time a search occurs. Default is -1.
 * @property: query | query string for PubMed. Default empty string.
 * @property: settings: object of settings - overridden by args at initilization.
 * {
    resultsPerPage: integer
  }
 */

var SearchCtlr = {
  countVal: -1,
  query: '',
  settings: null
};

/**
 * getPage - get a page of results.
 * @arg: pageNum: integer.
 * @return a promise which will resolve to the result summaries.
 */
SearchCtlr.getPage = function(pageNum) {
  pageNum = pageNum || 0;

  var firstResult = pageNum * this.settings.resultsPerPage + 1;
  var lastResult = (pageNum + 1) * this.settings.resultsPerPage;
  var search = createGateway.pubmedSearch(this.query, firstResult, lastResult);

  return search.resolve().then(eSearchDocument => {
    this.countVal = eSearchDocument.count();
    var summary = createGateway.pubmedSummary(eSearchDocument.ids());
    return summary.resolve('summaries');
  });
}

/**
 * nextPage - get the next page of results.
 * Starting at 0, you can retrieve all results by calling nextPage sequentially.
 * @return a promise which will resolve to a page's-worth of result summaries.
 */
SearchCtlr.nextPage = function() {
  var page = this.page(this.currentPage);
  this.currentPage++;
  return page;
}

SearchCtlr.search = function() {
  var page = this.page(0);
  this.currentPage = 1;
  return page;
}

/**
 * count - return the countVal (total number of results as specified by eUtils).
 */
SearchCtlr.count = function() {
  return this.countVal;
}

/**
 * Factory function for SearchCtlr.
 * @arg query - set the query.
 * @arg args - object literal of arguments.
 * {
 *  resultsPerPage | integer | default: 10
 * }
 */
module.exports = function(query, args) {
  var searchCtlr = Object.create(SearchCtlr);
  searchCtlr.query = query;
  searchCtlr.settings = _.extend({
    resultsPerPage: 10
  }, args);
  searchCtlr.currentPage = 0;
  return searchCtlr;
}
