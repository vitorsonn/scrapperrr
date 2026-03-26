export type ScrapedProduct = {
    name: string;
    price: number;
  };

  export interface Scraper{
    scrap(): Promise<ScrapedProduct>
  }

  export type ScraperConstructor = {
  new (url: string): Scraper;
  canHandle(url: string): boolean;
};