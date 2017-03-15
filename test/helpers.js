/* eslint-env mocha, node */

const check = require('check-types').assert;

module.exports = {

  /**
   * Define helper functions to get JSON data as JavaScript so that we can
   * query it
   */
  getDoc: function(filename, callback) {
    const parse = require('../src/gateways/parse');
    var fs = require('fs');
    var path = require('path');
    fs.readFile(path.join(__dirname, 'docs', filename), 'UTF-8', (err, data) => {
      callback(err, parse(data));
    });
  },


  /** Define helper function to determine if an object is a pubmed summary */
  isPubmedSummary: function(obj) {
    check.object(obj.raw);
    check.string(obj.pubDate);
    check.string(obj.title);
    check.string(obj.authors);
    check.number(obj.pmid);
  }

}
