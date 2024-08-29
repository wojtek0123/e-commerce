/*
  Warnings:

  - You are about to drop the column `numberPages` on the `book` table. All the data in the column will be lost.
  - You are about to drop the column `publishingDate` on the `book` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "book" DROP CONSTRAINT "book_publisherId_fkey";

-- AlterTable
ALTER TABLE "book" DROP COLUMN "numberPages",
DROP COLUMN "publishingDate",
ADD COLUMN     "pages" INTEGER,
ADD COLUMN     "publishedDate" TIMESTAMP(3),
ALTER COLUMN "publisherId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "book" ADD CONSTRAINT "book_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "publisher"("id") ON DELETE SET NULL ON UPDATE CASCADE;
