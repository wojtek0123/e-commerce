/*
  Warnings:

  - You are about to drop the column `surname` on the `user_address` table. All the data in the column will be lost.
  - Added the required column `lastName` to the `user_address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_address" DROP COLUMN "surname",
ADD COLUMN     "lastName" TEXT NOT NULL;
