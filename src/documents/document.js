const _ = require("underscore");

/**
Prototype NcbiDocument.
Stores the data in
@property record
and exposes a number of methods for extracting data.
**/
var NcbiDocument = {record: null};

/**
 * Perform a deep search on an object. Return an array of nodes identified by
 * the find argument.
 * NOTE: this function can call itself, and must be identified by a named
 * function expression.
 * @arg: find | string | the node key to search for
 * @arg: data | the object to search through.
 * @return: an array of nodes.
 */
NcbiDocument.deepSearch = function deepSearch(find, data) {
  data = data || this.record;
  var found = [];
  //if data is not an object, return an empty array.
  if ( ! _.isObject(data) ) {
    return found;
  }
  //go through each property, and assign it to found if the key
  //matches the key we're looking for
  _.each(data, function(value, key) {
    if (String(key).toLowerCase() === String(find).toLowerCase()) {
      found.push(value);
    }
    //now add in the nodes from the sub-object. If the value of the
    //property is not an object, deepSearch will just return an empty array.
    found = found.concat(deepSearch(find, value));
  });
  return found;
}

/**
 * Get the value for a particuler string. xml2js creates objects in a couple
 * of different ways, sometimes storing the value of a node as a propertry indexed
 * by the underscore character, and sometimes wrapping that in an array.
 * This function gets at the property contained within one or both of those
 * wrappers.
 * NOTE: this function can call itself, and must be identified by a named
 * function expression.
 * @arg: string, object, or array | representing a node usually created by xml2js
 * @return: string (at the top level) otherwise string, object or array
 */
NcbiDocument.nodeValue = function nodeValue(node) {
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

/**
 * Find the values of all nodes within an array.
 * @arg: nodes | array of nodes
 * @return: array of strings representing the values of those nodes
 */
NcbiDocument.nodeValues = function(nodes) {
  var valueArr = [];
  _.each(nodes, function(node) {
    valueArr.push( this.nodeValue(node) );
  }.bind(this));
  return valueArr;
}

/**
 * Helper function to return either a string for a single result or an
 * array for multiple results.
 * @arg results | Array
 * @arg single | Boolean
 * @return null, array, or string
 */
NcbiDocument.getStringOrArray = function(results, single) {
  if ( ! results.length ) {
    return null;
  } else if (single) {
    return results[0];
  } else {
    return results;
  }
}

module.exports = NcbiDocument;
