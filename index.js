var _ = require('underscore');
var Api = require('./src/Api.js');
var Parser = require('./src/Parser.js');

/**
 * 
 */

module.exports = {
  pubmedSearch : function(query, args) {
    var defaults = {
      start : 0,
      end : 10
    }
    var settings = _.extend(defaults, args);

    var search = new Api({
      method : 'esearch',
      params : {
        db : 'pubmed',
        term : query,
        retstart : settings.start,
        retmax : settings.end - settings.start
      }
    });
    var summary = new Api({
      method : 'esummary',
      params : {
        db : 'pubmed'
      }
    });

    return new Promise(function(resolve, reject) {
      var data = {};
      search.retrieve(['count', 'ids']).then(function(response) {
        data.total = response.count;
        if ( ! response.ids.length ) {
          data.papers = [];
          resolve(data);
        }
        summary.addIds(response.ids);
        summary.retrieve('summaries').then(function(response) {
          data.papers = response;
          resolve(data);
        });
      }).catch(function(err) {
        reject(err);
      });
    });
  },

  getAbstract : function(pmids) {
    //accept either single pmids or multiple
    if ( _.isNumber(pmids) ) {
      pmids = [pmids];
    } else if ( _.isString(pmids) ) {
      pmids = [ parseInt(pmids, 10) ];
    }
    var api = new Api({
      method : 'efetch',
      responseType : 'xml',
      params : {
        db : 'pubmed'
      }
    });
    api.addIds(pmids);
    return api.retrieve('abstract').then(function(abstracts) {
      if (abstracts.length === 1 && pmids.length === 1) {
        //if exactly 1 abstract was requested and exactly 1 was found,
        //return it as a string
        return abstracts[0];
      } else {
        //in all other cases (inluding none found), return an array
        return abstracts;
      }
    });
  }

}
