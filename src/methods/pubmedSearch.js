const _ = require('underscore');
var createGateway = require('../gateways');

module.exports = function(query, args) {
  const defaults = {
    start : 0,
    end : 10
  }
  const settings = _.extend(defaults, args);

  var search = createGateway.pubmedSearch(query, settings.start, settings.end);
  var summary = createGateway.pubmedSummary();

  return new Promise(function(resolve, reject) {
    var data = {};
    search.get().then(function(document) {

      data.count = document.count();

      var ids = document.ids();

      if ( ! ids.length ) {
        data.papers = [];
        resolve(data);
      }

      summary.addIds(ids);

      summary.get().then(function(document) {
        data.papers = document.summaries();
        resolve(data);
      }, function(err) {
        reject(err);
      });

    }, function(err) {
      reject(err);
    })
  });
}
