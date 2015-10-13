var parseString = require('xml2js').parseString;
var _ = require('underscore');

function NcbiData(data) {
  var dataObj;
  //read data: JS object, XML, or JSON
  if ( _.isObject(data) ) {
    dataObj = data;
  } else {
    try {
      dataObj = JSON.parse(data);
    } catch(err) {
      parseString(data, function(err, result) {
        if (err) {
          this.data = null;
        } else {
          dataObj = result;
        }
      });
    }
  }
  this.data = dataObj;
}

NcbiData.prototype.deepSearch = function deepSearch(find, data) {
  var found = [];
  if ( ! _.isObject(data) ) {
    return [];
  }
  _.each(data, function(value, key) {
    if (key === find) {
      found.push(value);
    }
    found = found.concat(deepSearch(find, value));
  });
  return found;
}

NcbiData.prototype.nodeValue = function nodeValue(node) {
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

NcbiData.prototype.nodeValues = function(nodes) {
  var valueArr = [];
  _.each(nodes, function(node) {
    valueArr.push( this.nodeValue(node) );
  }.bind(this));
  return valueArr;
}

module.exports = function(data) {
  return new NcbiData(data);
}
