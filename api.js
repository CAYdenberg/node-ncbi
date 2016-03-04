var ncbi = require('./index');

var search = ncbi.createSearch('ydenberg ca');

search.getPage().then((papers) => {
  console.log(papers);
}).catch((err) => {
  console.log(err.stack);
});
