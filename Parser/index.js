var _ = require('underscore');

var createDataObj = require('./createNcbiData');

module.exports = {

  getNcbiData: function(data) {
    return createDataObj(data);
  },

  count: function(data) {
    var dataObj = createDataObj(data);
    return dataObj.find(function(data) {
      return data.esearchresult.count
    }, true);
  },

  ids: function(data) {
    var dataObj = createDataObj(data);
    return dataObj.find(function(data) {
      return data.esearchresult.idlist;
    });
  },

  summaries: function(data, single) {
    var dataObj = createDataObj(data);
    return dataObj.find(function(data) {
      summaryArr = _.map(data.result, function(summary, key) {
        //papers are indexed by their uid.
        if ( parseInt(key, 10) ) {
          return summary;
        } else {
          return false;
        }
      });
      var curatedArr = _.without(summaryArr, false);
      if (!curatedArr.length) {
        return null;
      }
      return curatedArr;
    }, single);
  },

  abstract: function(data, single) {
    var dataObj = createDataObj(data);
    return dataObj.find('AbstractText');
  }

}
