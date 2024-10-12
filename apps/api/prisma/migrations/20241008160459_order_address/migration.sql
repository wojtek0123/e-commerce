/*
  Warnings:

  - A unique constraint covering the columns `[orderAddressId]` on the table `OrderDetails` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderAddressId` to the `OrderDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliveryTime` to the `ShippingMethod` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "UserAddress_countryId_key";

-- DropIndex
DROP INDEX "UserAddress_userId_key";

-- AlterTable
ALTER TABLE "OrderDetails" ADD COLUMN     "orderAddressId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ShippingMethod" ADD COLUMN     "deliveryTime" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UserAddress" ALTER COLUMN "houseNumber" DROP NOT NULL;

-- CreateTable
CREATE TABLE "OrderAddress" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postcode" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "houseNumber" TEXT,
    "homeNumber" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,

    CONSTRAINT "OrderAddress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrderDetails_orderAddressId_key" ON "OrderDetails"("orderAddressId");

-- AddForeignKey
ALTER TABLE "OrderDetails" ADD CONSTRAINT "OrderDetails_orderAddressId_fkey" FOREIGN KEY ("orderAddressId") REFERENCES "OrderAddress"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderAddress" ADD CONSTRAINT "OrderAddress_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;
