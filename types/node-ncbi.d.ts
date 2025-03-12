declare module "node-ncbi" {
  interface Paper {
    raw: object;
    pubDate: string;
    title: string;
    authors: string;
    pmid: number;
    pmc?: number;
    doi?: string;
  }
  
  module pubmed {
    function search(
      term: string,
      page?: number,
      limit?: number
    ): Promise<{
      count: number;
      papers: Array<Paper>;
    }>;

    function searchByRelevance(
      term: string,
      page?: number,
      limit?: number
    ): Promise<{
      count: number;
      papers: Array<Paper>;
    }>;

    function summary(pmid: number): Promise<Paper>;

    function summaries(pmids: string): Promise<Paper[]>;

    function abstract(pmid: number): Promise<string>;

    function cites(pmid: number): Promise<number[]>;

    function citedBy(pmid: number): Promise<number[]>;

    function similar(pmid: number): Promise<number[]>;

    function isOa(pmid: number): Promise<boolean>;

    function fulltext(pmid: number): Promise<string>;
  }

  module pmc {
    function summary(pmc: number): Promise<Paper>;
  }
}
