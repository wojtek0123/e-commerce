/*
  Warnings:

  - You are about to drop the column `shippingMethodId` on the `OrderDetails` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderShippingMethodId]` on the table `OrderDetails` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderShippingMethodId` to the `OrderDetails` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OrderDetails" DROP CONSTRAINT "OrderDetails_shippingMethodId_fkey";

-- AlterTable
ALTER TABLE "OrderDetails" DROP COLUMN "shippingMethodId",
ADD COLUMN     "orderShippingMethodId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "OrderShippingMethod" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderShippingMethod_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrderDetails_orderShippingMethodId_key" ON "OrderDetails"("orderShippingMethodId");

-- AddForeignKey
ALTER TABLE "OrderDetails" ADD CONSTRAINT "OrderDetails_orderShippingMethodId_fkey" FOREIGN KEY ("orderShippingMethodId") REFERENCES "OrderShippingMethod"("id") ON DELETE CASCADE ON UPDATE CASCADE;
