/*
  Warnings:

  - A unique constraint covering the columns `[bookId,shoppingSessionId]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "CartItem_bookId_key";

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_bookId_shoppingSessionId_key" ON "CartItem"("bookId", "shoppingSessionId");
