const repl = require('repl');
const open = require('open');

var replServer = repl.start({
  prompt: 'node-ncbi> '
});

const gateway = replServer.context.gateway = require('../src/gateways/createGateway');

const url = replServer.context.url = function(params) {
  params.test = true;
  var urlGateway = gateway(params);
  return urlGateway.generateUrl();
}

replServer.context.open = function(params) {
  open(url(params));
}
