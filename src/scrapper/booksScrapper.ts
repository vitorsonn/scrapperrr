import { chromium } from "playwright";
import { ScrapedProduct, Scraper } from "../models/scraper";

export class booksScrapper implements Scraper {
  //id de identificação para o log do worker

  constructor(private url: string) {}

  static canHandle(url: string): boolean {
    const hostname = new URL(url).hostname;
    return hostname === "books.toscrape.com";
  }

  async scrap(): Promise<ScrapedProduct> {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
      await page.goto(this.url, { waitUntil: "domcontentloaded" });

      await page.waitForSelector(".product_main");

      const name = await page.locator(".product_main h1").innerText();

      const priceText = await page
        .locator(".product_main .price_color")
        .innerText();

      return {
        name,
        price: extractPrice(priceText),
      };
    } finally {
      await browser.close();
    }
  }
}


export function extractPrice(priceText: string): number{
     if (!priceText) {
    throw new Error("Invalid price: empty string");
  }

  let normalized = priceText.replace(/[^\d.,]/g, "");


  if (normalized.includes(",") && normalized.includes(".")) {
    normalized = normalized.replace(/\./g, "").replace(",", ".");
  }

  else if (normalized.includes(",")) {
    normalized = normalized.replace(",", ".");
  }

  const price = Number(normalized);

  if (Number.isNaN(price)) {
    throw new Error(`Failed to parse price: ${priceText}`);
  }

  return price;
}

