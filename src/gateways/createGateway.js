const update = require('react-addons-update');
const popsicle = require('popsicle');

const parse = require('./parse');

/**
 * Prototype Gateway.
 * Intended as a wrapper around the PubMed eUtils REST-like API.
 * Full documentation of the API can be found here:
 * http://www.ncbi.nlm.nih.gov/books/NBK25500/
*/

var Gateway = {};

/**
 * Storage of the base URL for the API.
 * @return: a URL
 */
Gateway.getBase = function() {
  return this.base = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/' + this.settings.utility + '.fcgi?';
}

/**
 * Create the URL to access the API.
 * @return String | A URL representing the call that will be made, based on this.settings
 * Called by: this.send
 */
Gateway.generateUrl = function() {
  var url = this.getBase();
  for (var key in this.settings.params) {
    try {
      url += key + '=' + this.settings.params[key].toString();
      url += '&';
    } catch(e) {
      //skip if this parameter cannot be converted to a string
      continue;
    }
  }
  //remove final &
  url = url.substring(0, url.length - 1);
  return encodeURI(url);
}

/**
 * Send off the request.
 * @return: Promise | Call .then(function(response)) to process the response.
 * Call .catch(function(err)) to deal with errors.
 */
Gateway.send = function() {
  var url = this.generateUrl();
  return popsicle.get({
    method: 'GET',
    url: url
  });
}


/**
 * Send off the request and parse the returned data.
 * @return Promise | Call .then(function(document)) to access the methods in the
 * parser object (count, ids, summaries, abstract).
 * Alternatively if the name of the method is passed to resolve as a string,
 * the data retrieved by the method will be passed to the next promise in the
 * chain instead.
 * Call .catch(function(err)) to deal with errors.
 */
Gateway.resolve = function(query) {
  return this.send().then(res => {
    const dataObj = parse(res.body);
    return query(dataObj);
  });
};

/**
* Use an Object literal to instatiate via the setup method:
* @arg: documentType: string | 'esearch', 'esummary', 'efetch', 'einfo', see
* http://www.ncbi.nlm.nih.gov/books/NBK25499/ for more info
* @arg: responseType: string | 'json', 'xml', 'text'
* @arg: params: Object | indexed object of other URL parameters, eg 'term' (for searches),
* 'retstart', 'retmax'
* @arg: test: Boolean | enable test mode. When in test mode, an actual call will
* never happen, the search method will return a simple Promise instead.
*/
module.exports = function(args) {
  const defaults = {
    utility: 'esearch',
    params: {
      retmode: 'json',
      db: 'pubmed'
    }
  };
  let settings = update(defaults, {$merge: args, params: {$merge: args.params}});
  if (process.env.NCBI_API_KEY) {
    settings = update(settings, {params:
      {$merge: {api_key: process.env.NCBI_API_KEY} }
    })
  }
  const gateway = Object.assign(Object.create(Gateway), {
    settings: settings
  });
  return gateway;
}
