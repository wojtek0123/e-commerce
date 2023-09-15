/*
  Warnings:

  - You are about to drop the column `image` on the `book` table. All the data in the column will be lost.
  - You are about to drop the column `number_pages` on the `book` table. All the data in the column will be lost.
  - You are about to drop the column `publishing_date` on the `book` table. All the data in the column will be lost.
  - Added the required column `coverImage` to the `book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberPages` to the `book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publishingDate` to the `book` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "book" DROP COLUMN "image",
DROP COLUMN "number_pages",
DROP COLUMN "publishing_date",
ADD COLUMN     "coverImage" TEXT NOT NULL,
ADD COLUMN     "numberPages" INTEGER NOT NULL,
ADD COLUMN     "publishingDate" TIMESTAMP(3) NOT NULL;
