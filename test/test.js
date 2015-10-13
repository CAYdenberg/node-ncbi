//test the tests
var assert = require("assert")
describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    })
  })
})


var Gateway = require('../Gateway');
describe('Gateway', function() {

  var search = new Gateway({
    method : 'esearch',
    params : {
      db : 'pubmed',
      term : 'ydenberg ca'
    },
    test : true
  });
  describe('generateUrl', function() {
    it('should build a valid search url from parameters', function() {
      assert.equal(search.generateUrl(), 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=ydenberg%20ca&retmode=json');
    });
  });

  var summary = new Gateway({

  });

});


var parser = require('../parser');
describe('parser', function() {

  var xml = '<PubmedArticleSet> <PubmedArticle> <MedlineCitation Status="Publisher" Owner="NLM"> <PMID Version="1">26147656</PMID> <DateCreated> <Year>2015</Year> <Month>7</Month> <Day>6</Day> </DateCreated> <DateRevised> <Year>2015</Year> <Month>7</Month> <Day>7</Day> </DateRevised> <Article PubModel="Print-Electronic"> <Journal> <ISSN IssnType="Electronic">1949-3592</ISSN> <JournalIssue CitedMedium="Internet"> <PubDate> <Year>2015</Year> <Month>Jul</Month> <Day>3</Day> </PubDate> </JournalIssue> <Title>Cytoskeleton (Hoboken, N.J.)</Title> <ISOAbbreviation>Cytoskeleton (Hoboken)</ISOAbbreviation> </Journal> <ArticleTitle> Combinatorial genetic analysis of a network of actin disassembly-promoting factors. </ArticleTitle> <Pagination> <MedlinePgn/> </Pagination> <ELocationID EIdType="doi">10.1002/cm.21231</ELocationID> <Abstract> <AbstractText NlmCategory="UNASSIGNED"> The patterning of actin cytoskeleton structures in vivo is a product of spatially and temporally regulated polymer assembly balanced by polymer disassembly. While in recent years our understanding of actin assembly mechanisms has grown immensely, our knowledge of actin disassembly machinery and mechanisms has remained comparatively sparse. S. cerevisiae is an ideal system in which to tackle this problem, both because of its amenabilities to genetic manipulation and live-cell imaging, and because only a single gene encodes each of the core disassembly factors: cofilin (COF1), Srv2/CAP (SRV2), Aip1 (AIP1), GMF (GMF1/AIM7), coronin (CRN1), and twinfilin (TWF1). Among these six factors, only the functions of cofilin are essential and have been well defined. Here, we investigated the functions of the non-essential actin disassembly factors by performing genetic and live-cell imaging analyses on a combinatorial set of isogenic single, double, triple, and quadruple mutants in S. cerevisiae. Our results show that each disassembly factor makes an important contribution to cell viability, actin organization, and endocytosis. Further, our data reveal new relationships among these factors, providing insights into how they work together to orchestrate actin turnover. Finally, we observe specific combinations of mutations that are lethal, e.g., srv2Δ aip1Δ and srv2Δ crn1Δ twf1Δ, demonstrating that while cofilin is essential, it is not sufficient in vivo, and that combinations of the other disassembly factors perform vital functions. This article is protected by copyright. All rights reserved. </AbstractText> <CopyrightInformation>© 2015 Wiley Periodicals, Inc.</CopyrightInformation> </Abstract> <AuthorList> <Author> <LastName>Ydenberg</LastName> <ForeName>Casey A</ForeName> <Initials>CA</Initials> <AffiliationInfo> <Affiliation> Department of Biology, Rosenstiel Basic Medical Science Research Center, Brandeis University, Waltham, MA, 02454, USA. </Affiliation> </AffiliationInfo> </Author> <Author> <LastName>Johnston</LastName> <ForeName>Adam</ForeName> <Initials>A</Initials> <AffiliationInfo> <Affiliation> Department of Biology, Rosenstiel Basic Medical Science Research Center, Brandeis University, Waltham, MA, 02454, USA. </Affiliation> </AffiliationInfo> </Author> <Author> <LastName>Weinstein</LastName> <ForeName>Jaclyn</ForeName> <Initials>J</Initials> <AffiliationInfo> <Affiliation> Department of Biology, Rosenstiel Basic Medical Science Research Center, Brandeis University, Waltham, MA, 02454, USA. </Affiliation> </AffiliationInfo> </Author> <Author> <LastName>Bellavance</LastName> <ForeName>Danielle</ForeName> <Initials>D</Initials> <AffiliationInfo> <Affiliation> Department of Biology, Rosenstiel Basic Medical Science Research Center, Brandeis University, Waltham, MA, 02454, USA. </Affiliation> </AffiliationInfo> </Author> <Author> <LastName>Jansen</LastName> <ForeName>Silvia</ForeName> <Initials>S</Initials> <AffiliationInfo> <Affiliation> Department of Biology, Rosenstiel Basic Medical Science Research Center, Brandeis University, Waltham, MA, 02454, USA. </Affiliation> </AffiliationInfo> </Author> <Author> <LastName>Goode</LastName> <ForeName>Bruce L</ForeName> <Initials>BL</Initials> <AffiliationInfo> <Affiliation> Department of Biology, Rosenstiel Basic Medical Science Research Center, Brandeis University, Waltham, MA, 02454, USA. </Affiliation> </AffiliationInfo> </Author> </AuthorList> <Language>ENG</Language> <PublicationTypeList> <PublicationType UI="">JOURNAL ARTICLE</PublicationType> </PublicationTypeList> <ArticleDate DateType="Electronic"> <Year>2015</Year> <Month>7</Month> <Day>3</Day> </ArticleDate> </Article> <MedlineJournalInfo> <MedlineTA>Cytoskeleton (Hoboken)</MedlineTA> <NlmUniqueID>101523844</NlmUniqueID> <ISSNLinking>1949-3592</ISSNLinking> </MedlineJournalInfo> <KeywordList Owner="NOTNLM"> <Keyword MajorTopicYN="N">Aip1</Keyword> <Keyword MajorTopicYN="N">Cofilin</Keyword> <Keyword MajorTopicYN="N">Coronin</Keyword> <Keyword MajorTopicYN="N">GMF</Keyword> <Keyword MajorTopicYN="N">Srv2/CAP1</Keyword> <Keyword MajorTopicYN="N">Twinfilin</Keyword> <Keyword MajorTopicYN="N">actin</Keyword> <Keyword MajorTopicYN="N">actin disassembly</Keyword> <Keyword MajorTopicYN="N">cell polarity</Keyword> <Keyword MajorTopicYN="N">endocytosis</Keyword> <Keyword MajorTopicYN="N">yeast</Keyword> </KeywordList> </MedlineCitation> <PubmedData> <History> <PubMedPubDate PubStatus="received"> <Year>2015</Year> <Month>6</Month> <Day>23</Day> </PubMedPubDate> <PubMedPubDate PubStatus="revised"> <Year>2015</Year> <Month>6</Month> <Day>29</Day> </PubMedPubDate> <PubMedPubDate PubStatus="accepted"> <Year>2015</Year> <Month>6</Month> <Day>29</Day> </PubMedPubDate> <PubMedPubDate PubStatus="entrez"> <Year>2015</Year> <Month>7</Month> <Day>7</Day> <Hour>6</Hour> <Minute>0</Minute> </PubMedPubDate> <PubMedPubDate PubStatus="pubmed"> <Year>2015</Year> <Month>7</Month> <Day>7</Day> <Hour>6</Hour> <Minute>0</Minute> </PubMedPubDate> <PubMedPubDate PubStatus="medline"> <Year>2015</Year> <Month>7</Month> <Day>7</Day> <Hour>6</Hour> <Minute>0</Minute> </PubMedPubDate> </History> <PublicationStatus>aheadofprint</PublicationStatus> <ArticleIdList> <ArticleId IdType="doi">10.1002/cm.21231</ArticleId> <ArticleId IdType="pubmed">26147656</ArticleId> </ArticleIdList> </PubmedData> </PubmedArticle> </PubmedArticleSet>';
  var json = '{"header":{"type":"esearch","version":"0.3"},"esearchresult":{"count":"9","retmax":"9","retstart":"0","idlist":["26147656","25995115","24719456","23727094","22323294","22002930","19188495","18979235","18474625"],"translationset":[],"translationstack":[{"term":"ydenberg ca[Author]","field":"Author","count":"9","explode":"N"},"GROUP"],"querytranslation":"ydenberg ca[Author]"}}';

  describe('count', function() {
    it('should find the count field in a search result', function() {
      assert.equal(parser.count(json), 9);
    });
  });

  describe('ids', function() {
    it('should return an array of ids', function() {
      assert.equal(parser.ids(json).length, 9);
    });
  });

  describe('abstract', function() {
    it('should retrieve the abstract from an xml string', function() {
      assert.ok( parser.abstract(xml, true) );
    });
  });

});

//
//
// var actions = require('../lib/NCBI/ncbi.js');
// describe('ncbi', function() {
//
//   var pubmedSearch = actions.pubmedSearch;
//   describe('pubmedSearch', function() {
//     it('should search pubmed', function(done) {
//       var result = pubmedSearch('rose md', {resultsPerPage : 10}).then(function(res) {
//         assert.equal(res.papers.length, 10);
//         assert(res.total);
//         done();
//       });
//     });
//     it('should return an empty array if no results are found', function(done) {
//       var result = pubmedSearch('canucks flames').then(function(res) {
//         assert.equal(0, res.papers.length);
//         done();
//       });
//     });
//   });
//
//   var getAbstract = actions.getAbstract;
//   describe('getAbstract', function() {
//     it('should return the abstract from pubmed', function(done) {
//       getAbstract(26147656).then(function(data) {
//         assert.ok(data);
//         done();
//       });
//     });
//     it('should return multiple abstracts from pubmed', function(done) {
//       var result = getAbstract([25187651, 26147656]).then(function(data) {
//         assert.ok(data);
//         done();
//       });
//     });
//     it('should return null if bad pmid is sent', function(done) {
//       var result = getAbstract(0).then(function(data) {
//         assert.equal(0, data.length);
//         done();
//       });
//     });
//   });
//
// });
