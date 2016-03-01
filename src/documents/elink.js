var _ = require('underscore');

var ELinkDocument = require('./document');

/**
 * To parse citedBy:
 * http://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pubmed&db=pmc&cmd=neighbor&id=22588722&retmode=json
 * or maybe
 * http://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pubmed&db=pubmed&cmd=neighbor&id=22588722&retmode=json
 * which will also find cites and getSimilar.
 */

ELinkDocument.findLinks = function(linkname) {
  try {

    let linksetdb = _.find(this.record.linksets.linksetdbs, linksetdb => {
      return (linksetdb.linkname === linkname);
    });
    if (linksetdb) {
      return linksetdb.links;
    } else {
      return [];
    }

  } catch(e) {
    return null;
  }

}

ELinkDocument.citedBy = function() {
  return this.findLinks('pubmed_pubmed_citedin');
}

ELinkDocument.cites = function() {
  return this.findLinks('pubmed_pubmed_refs');
}

ELinkDocument.similar = function() {
  return this.findLinks('pubmed_pubmed');
}

module.exports = ELinkDocument;
