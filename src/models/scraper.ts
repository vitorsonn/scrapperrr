export type ScrapedProduct = {
    name: string;
    price: number;
  };

  export interface Scraper{
    getProductData(url: string): Promise<ScrapedProduct>
  }