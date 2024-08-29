/*
  Warnings:

  - You are about to drop the column `discountId` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `productCategoryId` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `productInventoryId` on the `product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "cart_item" DROP CONSTRAINT "cart_item_productId_fkey";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_productId_fkey";

-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_discountId_fkey";

-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_productCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_productInventoryId_fkey";

-- DropIndex
DROP INDEX "product_productInventoryId_key";

-- AlterTable
ALTER TABLE "product" DROP COLUMN "discountId",
DROP COLUMN "productCategoryId",
DROP COLUMN "productInventoryId";
