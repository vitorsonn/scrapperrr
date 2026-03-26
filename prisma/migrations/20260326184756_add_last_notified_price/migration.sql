/*
  Warnings:

  - You are about to drop the column `alertTriggered` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "alertTriggered",
ADD COLUMN     "lastNotifiedPrice" DOUBLE PRECISION;
