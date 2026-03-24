// scrapers/genericScraper.ts
import { chromium } from "playwright";
import { Scraper } from "../models/scraper";

export const genericScraper: Scraper = {
  id: "generic",

  canHandle: () => true,

  async getProductData(url: string) {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "domcontentloaded" });

    // ⚠️ você vai precisar ajustar isso por site
    const name = await page.title();

    const priceText = await page.locator("body").innerText();

    await browser.close();

    return {
      name,
      price: extractPrice(priceText),
    };
  },
};

function extractPrice(text: string): number {
  const match = text.match(/\d+[\.,]\d{2}/);
  if (!match) throw new Error("Price not found");

  return parseFloat(match[0].replace(",", "."));
}