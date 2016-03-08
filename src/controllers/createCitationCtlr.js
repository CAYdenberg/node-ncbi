const createGateway = require('../gateways');

/**
 * Citation controller.
 * Inisitalized with a pmid (PubMed id #) - used to retrieve summary, abstract,
 * citations, cited by, or similar articles.
 */

var CitationCtlr = {
  pmid: 0
};

/**
 * linkage - "private" method for getting linkage information.
 * Returns a promise that resolves to a set of summaries for the linked articles.
 */
CitationCtlr.linkage = function(linkType) {
  var link = createGateway.pubmedLinks(this.pmid);
  return link.resolve(linkType).then(ids => {
    var summary = createGateway.pubmedSummary(ids);
    return summary.resolve('summaries');
  });
}

/**
 * Wrappers for linkage method
 */
CitationCtlr.citedBy = function() {
  return this.linkage('citedBy');
}

CitationCtlr.cites = function() {
  return this.linkage('cites');
}

CitationCtlr.similar = function() {
  return this.linkage('similar');
}

/**
* Get the abstract
*/
CitationCtlr.abstract = function() {
  var abstract = createGateway.pubmedRecord(this.pmid);
  return abstract.resolve('abstracts');
}

/**
 * Get the summary
 */
CitationCtlr.summary = function() {
  var summary = createGateway.pubmedSummary(this.pmid);
  return summary.resolve().then(parser => {
    return parser.summaries(true);
  });
}

/**
 * Factory function for the citation controller.
 */
module.exports = function(pmid) {
  var citationCtlr = Object.create(CitationCtlr);
  citationCtlr.pmid = pmid;
  return citationCtlr;
}
