import { chromium } from "playwright";
import { ScrapedProduct, Scraper } from "../models/scraper";

export class genericScraper implements Scraper {
  constructor(private url: string) {}

  static canHandle(): boolean {
    return true;
  }

  async scrap(): Promise<ScrapedProduct> {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
      await page.goto(this.url, { waitUntil: "networkidle", timeout: 30000 });

      const name = await page.title();

      const candidates = await page
        .locator(
          `
        [class*="price"],
        [id*="price"],
        [data-testid*="price"]
      `,
        )
        .allInnerTexts();

      const price = this.extractBestPrice(candidates);

      if (!price) {
        throw new Error("Price not found");
      }

      return { name, price };
    } catch (error) {
      throw new Error(`Scraping failed: ${error}`);
    } finally {
      await browser.close();
    }
  }

  private extractBestPrice(texts: string[]): number | null {
    for (const text of texts) {
      const match = text.match(/R?\$\s?\d+[.,]?\d*/);
      if (match) {
        return this.normalizePrice(match[0]);
      }
    }
    return null;
  }

  private normalizePrice(price: string): number {
    return Number(price.replace(/[^\d,]/g, "").replace(",", "."));
  }
}
