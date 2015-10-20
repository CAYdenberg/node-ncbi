var _ = require('underscore');
var createGateway = require('./createGateway');
var parser = require('./parser');

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
      var needed = {};
      search.send().then(function(response) {
        needed.count = parser.count(response);
        var ids = parser.ids(response);

        if ( ! response.ids.length ) {
          needed.papers = [];
          resolve(data);
        }

        summary.addIds(ids);

        summary.send().then(function(response) {
          needed.papers = response;
          resolve(data);
        });

      }).catch(function(err) {
        //in case of any error, pass up the chain
        reject(err);
      });
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
    return gateway.send().then(function(response) {
      return abstracts = parser.abstracts(response, single);
    });
  }

}
