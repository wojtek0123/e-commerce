/*
  Warnings:

  - A unique constraint covering the columns `[productInventoryId]` on the table `Book` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Book_productInventoryId_key" ON "Book"("productInventoryId");
