/*
  Warnings:

  - You are about to drop the column `firstName` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `surname` on the `user` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `user_address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surname` to the `user_address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "firstName",
DROP COLUMN "surname";

-- AlterTable
ALTER TABLE "user_address" ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "surname" TEXT NOT NULL;
