const createGateway = require('../gateways');

module.exports = function(pmids, single) {

  var gateway = createGateway.abstract();

  gateway.addIds(pmids);

  return gateway.get().then(function(document) {
    return document.abstracts(single);
  });

}
