import { scraperQueue } from "../queue/scrapperQueue";
import { productRepository } from "../repositories/productRepository";
//adicionando produtos pela URL e salvando no bd

const createProduct = async (url: string, targetPrice: number) => {
  const cleanUrl = url?.trim();

  if (!cleanUrl) {
    throw new Error("invalid Url");
  }

  const existing = await productRepository.findByUrl(cleanUrl);

  if (existing) {
    throw new Error("product already exists");
  }

  if (
    typeof targetPrice !== "number" ||
    !Number.isFinite(targetPrice) ||
    targetPrice <= 0
  ) {
    throw new Error("invalid targetPrice");
  }

  const product = await productRepository.create({
    url: cleanUrl,
    targetPrice,
  });

  await scraperQueue.add(
    "scrapper",
    {
      productId: product.id,
      url: product.url,
    },

    {
      jobId: `scrape-${product.id}`,
      repeat: {
        every: 1000 * 10
      },
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5000,
      },
    },
  );

  return product;
};

const findAllProducts = async () => {
  return productRepository.findAll();
};

const updatePrice = async (productId: string, url: string) => {
  if (!url) throw new Error("invalid url");

  const cleanUrl = url.trim();

  await scraperQueue.add("scrapper", {
    productId,
    url: cleanUrl,
  });
};

export const productService = {
  createProduct,
  findAllProducts,
  updatePrice,
};
