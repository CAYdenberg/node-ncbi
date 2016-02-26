const repl = require('repl');
const gateway = require('../src/createGateway');
const methods = require('../src/methods');

var replServer = repl.start({
  prompt: 'node-ncbi> '
});

replServer.context.gateway = gateway;
replServer.context.methods = methods;


replServer.context.url = function(params) {
  params.test = true;
  var urlGateway = gateway(params);
  return urlGateway.generateUrl();
}
