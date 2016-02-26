const createGateway = require('../createGateway');

module.exports = function(pmids, single) {

  var gateway = createGateway({
    method : 'efetch',
    responseType : 'xml',
    params : {
      db : 'pubmed'
    }
  });
  gateway.addIds(pmids);
  return gateway.get().then(function(document) {
    return document.abstracts(single);
  });

}
