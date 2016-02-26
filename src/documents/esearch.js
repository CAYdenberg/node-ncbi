var ESearchDocument = require('./document');

ESearchDocument.count = function() {
  try {
    return this.record.esearchresult.count;
  } catch(e) {
    return null;
  }
}

ESearchDocument.ids = function() {
  try {
    return this.record.esearchresult.idlist;
  } catch(e) {
    return null;
  }
}

module.exports = ESearchDocument;
