/*
  Warnings:

  - A unique constraint covering the columns `[bookId]` on the table `ProductInventory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProductInventory_bookId_key" ON "ProductInventory"("bookId");
