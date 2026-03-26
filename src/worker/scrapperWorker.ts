import { Worker, Job } from "bullmq";
import { connection } from "../queue/connection";
import { productRepository } from "../repositories/productRepository";
import { ScraperFactory } from "../scrapper/scrapperFactory";
import { PriceAlertService } from "../domain/priceAlertService";

//chamando o scrapper
const handleScrappedProduct = async (job: Job) => {
  const { productId, url } = job.data;

  if (!productId || !url) {
    throw new Error("invalid job data");
  }

  try {
    const scrapper = ScraperFactory.get(url);

    const data = await scrapper.scrap();

    const product = await productRepository.findById(productId);

    const { priceChanged, shouldAlert } = PriceAlertService.evaluate(
      product,
      data,
    );

    if (!priceChanged) {
      console.log("Preço não mudou", { productId });
      return;
    }

    if (shouldAlert) {
      console.log("🚨 ALERTA DISPARADO", {
        productId,
        price: data.price
      });

      await productRepository.updateLastNotifiedPrice(productId, data.price);
    }

    await productRepository.update(productId, {
      currentPrice: data.price,
    });

    await productRepository.createPriceHistory(productId, data.price);

    console.log(`Produto ${data.name} atualizado: ${data.price}`);
  } catch (error) {
    console.error("Scraping failed:", error);
    throw error;
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
