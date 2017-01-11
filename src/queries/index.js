const update = require('react-addons-update');

const summaryQueries = require('./summaries');

const queries = {
  /**
   * Perform a deep search on an object. Return an array of nodes identified by
   * the find argument.
   * NOTE: this function can call itself, and must be identified by a named
   * function expression.
   * @arg: find | string | the node key to search for
   * @arg: data | the object to search through.
   * @return: an array of nodes.
   */
   deepSearch: function _deepSearch(find, data) {
     var found = [];
     //if data is not an object, return an empty array.
     if (typeof data !== 'object') {
       return found;
     }
     //go through each property, and assign it to found if the key
     //matches the key we're looking for
     Object.keys(data).forEach(key => {
       const value = data[key];
       if (String(key).toLowerCase() === String(find).toLowerCase()) {
         found.push(value);
       }
       //now add in the nodes from the sub-object. If the value of the
       //property is not an object, deepSearch will just return an empty array.
       found = found.concat(_deepSearch(find, value));
     });
     return found;
   },

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
  nodeValue: function nodeValue(node) {
    if (typeof node === 'string') {
      return node;
    } else if (Array.isArray(node)) {
      return nodeValue(node[0]);
    } else if (typeof node === 'object') {
      return nodeValue(node._);
    } else {
      return null;
    }
  },

  /**
   * Find the values of all nodes within an array.
   * @arg: nodes | array of nodes
   * @return: array of strings representing the values of those nodes
   */
  nodeValues: function(nodes) {
    return update(nodes, {$apply: (node) => {
      return queries.nodeValue(node);
    }});
  },

  count: function(data) {
    try {
      return data.esearchresult.count;
    } catch(e) {
      return 0;
    }
  },

  ids: function(data) {
    try {
      return data.esearchresult.idlist;
    } catch(e) {
      return [];
    }
  },

  summaries: function(data) {
    var found = [];
    try {
      var results = data.result;
    } catch(e) {
      return [];
    }
    Object.keys(results).forEach(key => {
      //papers are indexed by their uid, so if the key can be a number,
      // we should include it in the summary array. Otherwise we should skip it.
      if (parseInt(key, 10)) {
        const raw = results[key];
        const summary = summaryQueries.summary(raw);
        found.push(summary);
      }
    });
    return summaryQueries.sortSummaries(found);
  },

  /**
   * General method for finding links of a specific type. Step through all the
   * linksetdbs, looking for one where linkname matches a particular string, and then
   * return all the links in the array.
   */
  findLinks: function(linkname, data) {
    try {
      var linksets = [];
      //have not found a case where there is more than one linkset
      data.linksets[0].linksetdbs.forEach(linksetdb => {
        if (linksetdb.linkname === linkname) {
          linksets = linksets.concat(linksetdb.links);
        }
      });
      return linksets;
    } catch(e) {
      return [];
    }
  },

  /**
   * Perform a deep search for the abstract text and return it.
   * @arg single | Boolean, if true, return just one result as a string instead
   * of an array
   */
  abstract: function(data) {
    const nodes = queries.deepSearch('abstracttext', data);
    const values = queries.nodeValues(nodes);
    return values;
  },

  isOa: (data) => {
    const nodes = queries.deepSearch('body', data);
    return !!nodes.length;
  }

}

module.exports = queries;
