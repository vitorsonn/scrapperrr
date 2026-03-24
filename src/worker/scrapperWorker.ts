import { Worker, Job } from "bullmq";
import { connection } from "../queue/connection";
import { productRepository } from "../repositories/productRepository";
import { ScraperFactory } from "../scrapper/scrapperFactory";

//chamando o scrapper
const handleScrappedProduct = async (job: Job) => {
  const { productId, url } = job.data;

  try {
    const scrapper = ScraperFactory.get(url);

    const data = await scrapper.getProductData(url);

    await productRepository.updateNameAndCurrentPrice(productId, {
      name: data.name,
      currentPrice: data.price,
    });
    await productRepository.createPriceHistory(productId, data.price)

    console.log({
      event: "scraper_selected",
      scraper: scrapper.id,
      url
    });

    console.log(`Produto ${data.name} atualizado: ${data.price}`);
  } catch (error) {
    console.error("Scraping failed:", error);
  }
};
//executando o worker
export const scraperWorker = new Worker(
  "scrapper",
  async (job) => {
    if (job.name === "scrapper") {
      await handleScrappedProduct(job);
    }
  },
  {
    connection,
    concurrency: 3,
  },
);
