/*
  Warnings:

  - You are about to drop the column `productInventoryId` on the `Book` table. All the data in the column will be lost.
  - Made the column `bookId` on table `ProductInventory` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Book" DROP CONSTRAINT "Book_productInventoryId_fkey";

-- DropIndex
DROP INDEX "Book_productInventoryId_key";

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "productInventoryId";

-- AlterTable
ALTER TABLE "ProductInventory" ALTER COLUMN "bookId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "ProductInventory" ADD CONSTRAINT "ProductInventory_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
