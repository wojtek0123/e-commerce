/*
  Warnings:

  - A unique constraint covering the columns `[orderDetailsId]` on the table `OrderItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "OrderItem_orderDetailsId_key" ON "OrderItem"("orderDetailsId");
