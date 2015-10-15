var _ = require('underscore');

var createDataObj = require('./createDataObj');

module.exports = {

  count: function(data) {
    var dataObj = createDataObj(data);
    return dataObj.find(function(data) {
      console.log(data);
      return [data.esearchresult.count]
    }, true);
  },

  ids: function(data) {
    var dataObj = createDataObj(data);
    return dataObj.find(function(data) {
      return data.esearchresult.idlist;
    });
  },

  summaries: function(data) {
    var dataObj = createDataObj(data);
    summaryArr = _.map(dataObj.data.result, function(summary, key) {
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
  },

  abstract: function(data, single) {
    var dataObj = createDataObj(data);
    return dataObj.find('AbstractText');
  }

}
