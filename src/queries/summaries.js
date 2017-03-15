const summaryQueries = {

  formatAuthors: function(authorsArray) {
    const namesArr = authorsArray.map((author) => {
      return author.name;
    });
    return namesArr.join(', ');
  },

  summary: function(data) {
    var summary = {
      raw: data,
      title: data.title || '',
      authors: summaryQueries.formatAuthors(data.authors) || '',
      pubDate: data.sortpubdate
    };
    data.articleids.forEach((idObject) => {
      if (idObject.idtype === 'pubmed') {
        //Change pubmed to pmid. Make sure it's an integer.
        summary.pmid = parseInt(idObject.value, 10);
      } else if (idObject.idtype === 'pmc') {
        //Remove PMC from the beginning of the string and make sure it's an integer.
        summary.pmc = parseInt(idObject.value.replace('PMC', ''));
      } else if (idObject.idtype === 'doi') {
        //Move DOI to the top level
        summary.doi = idObject.value;
      }
    });
    return summary;
  },

  sortSummaries: function(summaries, sortingFunc) {
    if (sortingFunc) {
      summaries.sort(sortingFunc);
    } else {
      //default sorting function: reverse chronological
      summaries.sort(function(a, b) {
        var aNumericDate = a.pubDate.replace(/\D/g,'');
        var bNumericDate = b.pubDate.replace(/\D/g,'');
        return bNumericDate - aNumericDate;
      });
    }
    return summaries;
  }

}

module.exports = summaryQueries;
