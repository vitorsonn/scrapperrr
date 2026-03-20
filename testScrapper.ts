import { genericScrapper } from './src/scrapper/genericScrapper';

async function main() {
  const url = "https://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html"; // troca por produto real

  try {
    const data = await genericScrapper.getProductData(url);
    console.log(data);
    
    
  } catch (err) {
    console.error("Erro", err);
  }
  
}

main();