import { chromium } from "playwright";
import { Scraper } from "../models/scraper";

export const genericScrapper: Scraper = {
    async getProductData(url: string) {
        const browser = await chromium.launch()
        const page = await browser.newPage()

        //abre a pagina e espera abrir
        await page.goto(url, {waitUntil: "domcontentloaded"})


        //pega o titulo da pagina
        const name = await page.title();
        //procura o texto referente ao price no body do site
        const priceText = await page.locator("body").innerText();
        
        //finaliza quando termina
        await browser.close();

        return{
            name,
            price: extractPrice(priceText)
        }
        
    }
}
//função que vai receber o texto do body e extrair apenas o preço
function extractPrice(text: string): number{
    const match = text.match(/\d+[\.,]\d{2}/);
  if (!match) throw new Error("Price not found");
  return parseFloat(match[0].replace(",", "."));
}

