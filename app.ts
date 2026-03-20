import express from "express";
import productRoutes from "./src/routes/productRoutes"

const app = express();

app.use(express.json());
app.use(productRoutes);

export default app;