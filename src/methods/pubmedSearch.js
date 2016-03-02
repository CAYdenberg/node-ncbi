const _ = require('underscore');
const createGateway = require('../gateways');

module.exports = function(query, args) {
  const defaults = {
    start : 0,
    end : 10
  }
  const settings = _.extend(defaults, args);

  var search = createGateway.pubmedSearch(query, settings.start, settings.end);
  var summary = createGateway.pubmedSummary();

  var data = {};
  return search.get(function(parser, resolve) {
    data.count = parser.count();
    var ids = parser.ids();

    if (!ids.length) {
      data.papers = [];
      resolve(data);
    } else {
      summary.addIds(ids);
      summary.get(function(document) {
        data.papers = document.summaries();
        resolve(data);
      });
    }

  });
}
