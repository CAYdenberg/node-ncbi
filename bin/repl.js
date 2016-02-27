const repl = require('repl');
const open = require('open');


var replServer = repl.start({
  prompt: 'node-ncbi> '
});

const gateway = replServer.context.gateway = require('../src/createGateway');


const url = replServer.context.url = function(params) {
  params.test = true;
  var urlGateway = gateway(params);
  return urlGateway.generateUrl();
}

replServer.context.open = function(params) {
  open(url(params));
}

const methodsLib = require('../src/methods');

replServer.context.method = function() {
  const method = arguments[0];
  const args = Array.prototype.slice.call(arguments, 1);
  return methodsLib[method](args).then(result => {
    console.log(result);
  });
}
