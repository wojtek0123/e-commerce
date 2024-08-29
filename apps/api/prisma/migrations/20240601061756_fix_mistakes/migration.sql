/*
  Warnings:

  - You are about to drop the column `updatedAat` on the `BookAuthor` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `BookAuthor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BookAuthor" DROP COLUMN "updatedAat",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
