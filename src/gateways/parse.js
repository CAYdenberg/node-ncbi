const parseString = require('xml2js').parseString;

module.exports = (data) => {
  var dataObj;
  //if simple javascript object
  if (typeof data === 'object') {
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
