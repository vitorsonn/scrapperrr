import { Router } from "express";
import { productController } from "../controllers/productController";

const router = Router()

router.post("/products",productController.create)
router.get("/products",productController.findAll)

export default router