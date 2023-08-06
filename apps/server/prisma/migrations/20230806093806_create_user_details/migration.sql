/*
  Warnings:

  - You are about to drop the column `Street` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `homeNumber` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `houseNumber` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `user` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "Street",
DROP COLUMN "city",
DROP COLUMN "homeNumber",
DROP COLUMN "houseNumber",
DROP COLUMN "name",
DROP COLUMN "phone",
ADD COLUMN     "firstName" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "UserDetails" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "houseNumber" TEXT NOT NULL,
    "homeNumber" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserDetails_userId_key" ON "UserDetails"("userId");

-- AddForeignKey
ALTER TABLE "UserDetails" ADD CONSTRAINT "UserDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
