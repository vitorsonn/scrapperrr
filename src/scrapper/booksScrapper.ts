import { chromium } from "playwright";
import { Scraper } from "../models/scraper";

export const booksScrapper: Scraper = {
    //id de identificação para o log do worker
    id: "books", 

    //canHandle é tipo o "se tiver essa URL, dale"

    canHandle: (url: string) => {
        const hostname = new URL(url).hostname
        return hostname === "books.toscrape.com";
    },

    async getProductData(url: string) {
        const browser = await chromium.launch({ headless: true });
        const page = await browser.newPage()

        //abre a pagina e espera abrir
        await page.goto(url, {waitUntil: "domcontentloaded"})


        //pega o titulo da pagina
        const name = await page.locator(".product_main h1").innerText();
        //procura o texto referente ao price (seletor especifico do bookscrapper)
        
        await page.waitForSelector(".product_main")

        
        const priceText = await page.locator(".product_main .price_color").innerText()
        
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

