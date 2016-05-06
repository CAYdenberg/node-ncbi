
const repl = require('repl');
const open = require('open');

var replServer = repl.start({
  prompt: 'node-ncbi> '
});

const gateway = replServer.context.gateway = require('../src/gateways/createGateway');

const url = replServer.context.url = function(args) {
  var urlGateway = gateway(args);
  return urlGateway.generateUrl();
}

replServer.context.open = function(args) {
  open(url(args));
  return;
}

replServer.context.noop = function() {
  return '';
}
