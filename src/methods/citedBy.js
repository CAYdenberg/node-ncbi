const createGateway = require('../gateways');

module.exports = function(pmid) {

  var citedBy = createGateway.citedBy();
  var summary = createGateway.summaries();

  citedBy.addIds(pmid);

  return new Promise(function(resolve, reject) {
    var data = {};
    citedBy.get().then(function(document) {

      var ids = document.citedBy();
      data.count = ids.length;

      if (!ids.length) {
        data.papers = [];
        resolve(data);
      }
      summary.addIds(ids);
      summary.get().then(function(document) {
        data.papers = document.summaries();
        resolve(data);
      }, function(err) {
        reject(err);
      });

    }, function(err) {
      reject(err);
    });
  });

}
