import { prisma } from "../config/database";

const create = (data: {
  url: string;
  targetPrice: number;
  name?: string;
  currentPrice?: number;
  lastNotifiedPrice?: number | null;
}) => {
  return prisma.product.create({ data });
};

const findByUrl = (url: string) => {
  return prisma.product.findUnique({ where: { url } });
};

const findById = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      url: true,
      name: true,
      currentPrice: true,
      targetPrice: true,
      lastNotifiedPrice: true,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

const updateLastNotifiedPrice = (id: string, price: number) => {
  return prisma.product.update({
    where: { id },
    data: { lastNotifiedPrice: price },
  });
};

const findAll = () => {
  return prisma.product.findMany();
};

const update = (
  id: string,
  data: Partial<{
    name: string;
    currentPrice: number;
    lastNotifiedPrice: number;
  }>,
) => {
  return prisma.product.update({
    where: { id },
    data,
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
  findById,
  findAll,
  update,
  createPriceHistory,
  updateLastNotifiedPrice,
};
