/*
  Warnings:

  - Added the required column `postcode` to the `user_address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_address" ADD COLUMN     "postcode" TEXT NOT NULL;
