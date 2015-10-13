var _ = require('underscore');

var createDataObj = require('./createDataObj');

module.exports = {

  count: function(data) {
    var dataObj = createDataObj(data);
    try {
      return dataObj.data.esearchresult.count;
    } catch(err) {
      return null;
    }
  },

  ids: function(data) {
    var dataObj = createDataObj(data);
    try {
      return dataObj.data.esearchresult.idlist;
    } catch(err) {
      return null;
    }
  },

  summaries: function(data) {
    var dataObj = createDataObj(data);
    summaryArr = _.map(dataObj.data.result, function(summary, key) {
      //papers are indexed by their uid.
      if ( loadDataInt(key, 10) ) {
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
    var record,
      abstractObjs = [],
      abstractStrs = [],
      dataObj = createDataObj(data);
    abstractObjs = dataObj.deepSearch('AbstractText', dataObj.data);
    abstractStrs = dataObj.nodeValues(abstractObjs);
    if (!abstractStrs.length) {
      return null;
    }
    //figure out what to return based on whether single is true
    if (single) {
      //return a string
      return abstractStrs[0];
    } else {
      //return an array of strings
      return abstractStrs;
    }
  }

}
