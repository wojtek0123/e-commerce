/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `OrderDetails` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "OrderDetails_userId_key" ON "OrderDetails"("userId");
