import { prisma } from "../config/database";

const create = (data: {
  url: string;
  targetPrice: number;
  name?: string;
  currentPrice?: number;
}) => {
  return prisma.product.create({ data });
};

const findByUrl = (url: string) => {
  return prisma.product.findUnique({ where: { url } });
};

const findAll = () => {
  return prisma.product.findMany();
};

const updateCurrentPrice = (id: string, price: number) => {
  return prisma.product.update({
    where: { id },
    data: { currentPrice: price },
  });
};

const createPriceHistory = (productId: string, price: number) => {
  return prisma.priceHistory.create({
    data: {
      productId,
      price,
    },
  });
};

export const productRepository = {
  create,
  findByUrl,
  findAll,
  updateCurrentPrice,
  createPriceHistory,
};