/*
  Warnings:

  - A unique constraint covering the columns `[productInventoryId]` on the table `product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `discountId` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productCategoryId` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productInventoryId` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product" ADD COLUMN     "discountId" INTEGER NOT NULL,
ADD COLUMN     "productCategoryId" INTEGER NOT NULL,
ADD COLUMN     "productInventoryId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "product_productInventoryId_key" ON "product"("productInventoryId");

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_productCategoryId_fkey" FOREIGN KEY ("productCategoryId") REFERENCES "product_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_productInventoryId_fkey" FOREIGN KEY ("productInventoryId") REFERENCES "product_inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_discountId_fkey" FOREIGN KEY ("discountId") REFERENCES "discount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
