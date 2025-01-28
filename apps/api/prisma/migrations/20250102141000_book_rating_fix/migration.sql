/*
  Warnings:

  - Added the required column `rating` to the `BookRating` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BookRating" ADD COLUMN     "rating" INTEGER NOT NULL;
