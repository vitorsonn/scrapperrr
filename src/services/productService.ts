import { productRepository } from "../repositories/productRepository";
import { genericScrapper } from "../scrapper/genericScrapper";

//adicionando produtos pela URL
const createProduct = async(url: string, targetPrice: number) => {
    if(!url || !targetPrice){
        throw new Error("invalid data")
    }

    const existing = await productRepository.findByUrl(url)

    if(existing){
        throw new Error("product already exists")
    }

    const scrapedProduct = await genericScrapper.getProductData(url)

    return productRepository.create({
        url,
        name: scrapedProduct.name,
        currentPrice: scrapedProduct.price,
        targetPrice
    })

}


const findAllProducts = async () => {
    return productRepository.findAll()
}

const updatePrice = async (productId: string, price: number) => {
    await productRepository.updateCurrentPrice(productId, price)

    await productRepository.createPriceHistory(productId, price)
}

export const productService = {
    createProduct,
    findAllProducts,
    updatePrice,
  };