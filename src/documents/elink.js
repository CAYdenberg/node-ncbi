const _ = require('underscore');

var ELinkDocument = require('./document');

/**
 * To parse citedBy:
 * http://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pubmed&db=pmc&cmd=neighbor&id=22588722&retmode=json
 * or maybe
 * http://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pubmed&db=pubmed&cmd=neighbor&id=22588722&retmode=json
 * which will also find cites and getSimilar.
 */

/**
 * General method for finding links of a specific type. Step through all the
 * linksetdbs, looking for one where linkname matches a particular string, and then
 * return all the links in the array.
 */
ELinkDocument.findLinks = function(linkname) {

  try {

    //have not found a case where there is more than one linkset
    var foundLinkset = _.find(this.record.linksets[0].linksetdbs, linksetdb => {
      return (linksetdb.linkname === linkname);
    });
    if (foundLinkset) {
      return foundLinkset.links;
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
