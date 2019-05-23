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
      if( typeof data == 'string' ) {
        data = data.replace( /<sup>/g, '[sup]').replace( /<\/sup>/g, '[/sup]')
        data = data.replace( /<i>/g, '[i]').replace( /<\/i>/g, '[/i]')
        data = data.replace( /<sub>/g, '[sub]').replace( /<\/sub>/g, '[/sub]')
        data = data.replace( /<strong>/g, '[strong]').replace( /<\/strong>/g, '[/strong]')
        data = data.replace( /<b>/g, '[b]').replace( /<\/b>/g, '[/b]')
        data = data.replace( /<u>/g, '[u]').replace( /<\/u>/g, '[/u]')
      }
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
