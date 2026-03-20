import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

declare global {
    var prisma: PrismaClient | undefined;
  }
  
  export const prisma =
    global.prisma ||
    new PrismaClient({
      adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
    });
  
  if (process.env.NODE_ENV !== "production") {
    global.prisma = prisma;
  }