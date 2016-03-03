const _ = require('underscore');
const createGateway = require('../gateways');

var CitationCtlr = {
  pmid: 0
};

CitationCtlr.linkage = function(linkType) {
  var link = createGateway.elink(this.pmid);
  return link.resolve(linkType).then(ids => {
    var summary = createGateway.pubmedSummary(ids);
    return summary.resolve('summaries');
  }).then(summaries => {
    return summaries;
  });
}

CitationCtlr.citedBy = function() {
  return this.linkage('citedBy');
}

CitationCtlr.cites = function() {
  return this.linkage('cites');
}

CitationCtlr.similar = function() {
  return this.linkage('similar');
}

CitationCtlr.abstract = function() {
  var abstract = createGateway.pubmedRecord(this.pmid);
  return abstract.resolve('abstracttext');
}

CitationCtlr.summary = function() {
  var summary = createGateway.pubmedSummary(this.pmid);
  return summary.resolve().then(parser => {
    return parser.summaries(true);
  });
}

module.exports = function(pmid) {
  var citationCtlr = Object.create(CitationCtlr);
  citationCtlr.pmid = pmid;
  return citationCtlr;
}
