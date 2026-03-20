import { Request, Response } from "express";
import { productService } from "../services/productService";

export const productController = {

    async create(req: Request, res: Response){
        try{
            const {url, targetPrice} = req.body

            const product = await productService.createProduct(url, targetPrice)

            return res.status(201).json(product)
        }

        catch(err: any){
            return res.status(400).json({ error: err.message });
        }


    },

    async findAll(req: Request, res: Response){
        const products = await productService.findAllProducts()

        return res.json(products)
    }


}