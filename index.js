var _ = require('underscore');
var createGateway = require('./createGateway');

module.exports = {

  pubmedSearch : function(query, args) {
    var defaults = {
      start : 0,
      end : 10
    }
    var settings = _.extend(defaults, args);

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
        });

      })
    });
  },

  getAbstract : function(pmids, single) {

    var gateway = createGateway({
      method : 'efetch',
      responseType : 'xml',
      params : {
        db : 'pubmed'
      }
    });
    gateway.addIds(pmids);
    return gateway.get().then(function(document) {
      return document.abstracts(single);
    });
  }

}
