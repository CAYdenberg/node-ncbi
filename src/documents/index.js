const parseString = require('xml2js').parseString;
const _ = require("underscore");

const DocumentPrototypes = {
  esearch: require('./esearch'),
  esummary: require('./esummary'),
  efetch: require('./efetch')
};

function parse(data) {
  var dataObj;
  //if simple javascript object
  if ( _.isObject(data) ) {
    dataObj = data;
  } else {
    //try JSON
    try {
      dataObj = JSON.parse(data);
    } catch(err) {
      //try XML
      parseString(data, function(err, result) {
        if (err) {
          dataObj = null;
        } else {
          dataObj = result;
        }
      });
    }
  }
  return dataObj;
}

module.exports = function(data, type) {
  var doc = Object.create(DocumentPrototypes[type]);
  doc.record = parse(data);
  return doc;
}
