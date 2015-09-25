var Api = require('./Api.js');
var parseString = require('xml2js').parseString;
var _ = require('underscore');

function Parser(data, parserName) {
  var dataObj,
    isValid = true;
  //read data: JS object, XML, or JSON
  if ( _.isObject(data) ) {
    dataObj = data;
  } else {
    try {
      dataObj = JSON.parse(data);
    } catch(err) {
      parseString(data, function(err, result) {
        if (err) {
          isValid = false;
        } else {
          dataObj = result
        }
      });
    }
  }
  //set properties
  if (isValid) {
    this.isValid = true;
    this.data = dataObj;
    this.execute(parserName);
  } else {
    this.isValid = false;
    this.data = null;
    this.result = null;
  }
}

Parser.prototype._deepSearch = function deepSearch(data, find) {
  var found = [];
  if ( ! _.isObject(data) ) {
    return [];
  }
  _.each(data, function(value, key) {
    if (key === find) {
      found.push(value);
    }
    found = found.concat(deepSearch(value, find));
  });
  return found;
}

Parser.prototype._nodeValue = function nodeValue(node) {
  if ( _.isString(node) ) {
    return node;
  } else if ( _.isArray(node) ) {
    return nodeValue(node[0]);
  } else if ( _.isObject(node) ) {
    return nodeValue(node._);
  } else {
    return null;
  }
}

Parser.prototype._nodeValues = function(nodes) {
  var valueArr = [],
    o = this;
  _.each(nodes, function(node) {
    valueArr.push( o._nodeValue(node) );
  });
  return valueArr;
}

Parser.prototype.count = function() {
  return this.data.esearchresult.count;
}

Parser.prototype.ids = function() {
  return this.data.esearchresult.idlist;
}

Parser.prototype.summaries = function() {
  summaryArr = _.map(this.data.result, function(summary, key) {
    //papers are indexed by their uid.
    if ( parseInt(key, 10) ) {
      return summary;
    } else {
      return false;
    }
  });
  return _.without(summaryArr, false);
}

Parser.prototype.abstract = function(single) {
  var record,
    abstractObjs = [],
    abstractStrs = [];
  //convert XML to JS object
  abstractObjs = this._deepSearch(this.data, 'AbstractText');
  abstractStrs = this._nodeValues(abstractObjs);
  //figure out what to return based on whether single is true;
  if ( !abstractStrs.length ) {
    return [];
  }
  if (single) {
    return abstractStrs[0];
  } else {
    return abstractStrs;
  }
}

Parser.prototype.execute = function(parserName) {
  var o = this,
    funcName;
  if ( _.isFunction(this[parserName]) ) {
    this.result = this[parserName]();
  } else if ( _.isArray(parserName) ) {
    this.result = {};
    for (var i in parserName) {
      funcName = parserName[i];
      if ( _.isFunction( this[funcName] ) ) {
        this.result[funcName] = this[funcName]();
      } else {
        this.result[funcName] = null;
      }
    }
  } else {
    this.result = null;
  }
  return this.result;
}

module.exports = Parser;
