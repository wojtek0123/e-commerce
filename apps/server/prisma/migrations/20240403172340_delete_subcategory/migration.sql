/*
  Warnings:

  - You are about to drop the `subcategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "subcategory" DROP CONSTRAINT "subcategory_categoryId_fkey";

-- DropTable
DROP TABLE "subcategory";
