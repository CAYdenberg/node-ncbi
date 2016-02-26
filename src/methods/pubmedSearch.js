const _ = require('underscore');
const createGateway = require('../createGateway');

module.exports = function(query, args) {
  const defaults = {
    start : 0,
    end : 10
  }
  const settings = _.extend(defaults, args);

  var search = createGateway({
    method : 'esearch',
    params : {
      db : 'pubmed',
      term : query,
      retstart : settings.start,
      retmax : settings.end - settings.start
    }
  });
  var summary = createGateway({
    method : 'esummary',
    params : {
      db : 'pubmed'
    }
  });

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
