import { Scraper } from "../models/scraper";
import { booksScrapper } from "./booksScrapper";
import { genericScraper } from "./genericScrapper";


const scrappers: Scraper[] = [
    booksScrapper,
    genericScraper //generic sempre por ultimo
]

export class ScraperFactory {
    //funcao de buscar o scrapper na lista de Scrapper
    static get(url: string): Scraper {
        const scrapper = scrappers.find(s => s.canHandle(url));

        if (!scrapper) {
            throw new Error("No scraper found");
        }

        return scrapper;
    }
}
