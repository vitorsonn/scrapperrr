import { productRepository } from "../repositories/productRepository";
import { genericScrapper } from "../scrapper/genericScrapper";

//adicionando produtos pela URL e salvando no bd


const createProduct = async(url: string, targetPrice: number) => {
    
    const cleanUrl = url?.trim()

    if(!cleanUrl){
        throw new Error("invalid Url")
    }

    const existing = await productRepository.findByUrl(url)

    if(existing){
        throw new Error("product already exists")
    }

    if (typeof targetPrice !== "number" || !Number.isFinite(targetPrice) || targetPrice <= 0) {
        throw new Error("invalid targetPrice");
      }


    //scrapper "acontece" aqui
    const scrapedProduct = await genericScrapper.getProductData(cleanUrl)

    const cleanName = scrapedProduct.name?.trim();
    if (!cleanName) {
      throw new Error("invalid scraped product name");
    }
    // valida preço do scrapper (Prisma: Float pode ser null, mas aqui você vai salvar currentPrice)
    const scrapedPrice = scrapedProduct.price;
    if (typeof scrapedPrice !== "number" || !Number.isFinite(scrapedPrice) || scrapedPrice <= 0) {
      throw new Error("invalid scraped product price");
    }

    return productRepository.create({
        url: cleanUrl,
        name: cleanName,
        currentPrice: scrapedPrice,
        targetPrice
    })

}


const findAllProducts = async () => {
    return productRepository.findAll()
}

const updatePrice = async (productId: string, url: string) => {
try{
    const cleanUrl = url?.trim()
    const scrapedProduct = await genericScrapper.getProductData(cleanUrl)

    await productRepository.updateCurrentPrice(productId, scrapedProduct.price)
    await productRepository.createPriceHistory(productId, scrapedProduct.price)

}

catch(err){
    console.error("Scraping failed for:", url);
}
    
}

export const productService = {
    createProduct,
    findAllProducts,
    updatePrice,
  };