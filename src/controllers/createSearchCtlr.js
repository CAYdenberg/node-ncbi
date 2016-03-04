const _ = require('underscore');

const createGateway = require('../gateways');

var SearchCtlr = {
  countVal: -1,
  query: '',
  settings: null
};

SearchCtlr.getPage = function(pageNum) {
  pageNum = pageNum || 0;

  var firstResult = pageNum * this.settings.resultsPerPage + 1;
  var lastResult = (pageNum + 1) * this.settings.resultsPerPage;
  var search = createGateway.pubmedSearch(this.query, firstResult, lastResult);

  return search.resolve().then(eSearchDocument => {
    this.countVal = eSearchDocument.count();
    var summary = createGateway.pubmedSummary(eSearchDocument.ids());
    return summary.resolve('summaries');
  }).then(summaries => {
    return summaries;
  });
}

SearchCtlr.nextPage = function() {
  var page = this.page(this.currentPage);
  this.currentPage++;
  return page;
}

SearchCtlr.count = function() {
  return this.countVal;
}

module.exports = function(query, args) {
  var searchCtlr = Object.create(SearchCtlr);
  searchCtlr.query = query;
  searchCtlr.settings = _.extend({
    resultsPerPage: 10
  }, args);
  searchCtlr.currentPage = 0;
  return searchCtlr;
}
