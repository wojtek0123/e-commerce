/*
  Warnings:

  - You are about to drop the column `refreshTokren` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "refreshTokren",
ADD COLUMN     "refreshToken" TEXT;
