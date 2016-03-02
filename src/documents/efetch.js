var EFetchDocument = require('./document');

/**
 * Perform a deep search for the abstract text and return it.
 * @arg single | Boolean, if true, return just one result as a string instead
 * of an array
 */
EFetchDocument.abstracts = function(single) {
  var nodes = this.deepSearch('abstracttext');
  var values = this.nodeValues(nodes);
  return this.getStringOrArray(values, single);
}

module.exports = EFetchDocument;
