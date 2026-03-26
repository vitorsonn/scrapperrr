import { ScraperConstructor } from './../models/scraper';
import { Scraper } from "../models/scraper";
import { booksScrapper } from "./booksScrapper";
import { genericScraper } from "./genericScrapper";


const scrappers: ScraperConstructor[] = [
    booksScrapper,
    genericScraper //generic sempre por ultimo
]



export class ScraperFactory {
  static get(url: string): Scraper {
    const ScraperClass = scrappers.find(S => S.canHandle(url)
    );

    if (!ScraperClass) {
      throw new Error("No scraper found");
    }

    return new ScraperClass(url);
  }
}