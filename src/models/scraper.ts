export type ScrapedProduct = {
    name: string;
    price: number;
  };

  export interface Scraper{
    id: string
    canHandle(url: string): boolean //todo contrato vai ter o canHandle de verificação da URL para ser ativado
    getProductData(url: string): Promise<ScrapedProduct>
  }