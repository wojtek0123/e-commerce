/*
  Warnings:

  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `user_address` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `user_address` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `userId` on the `user_address` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "user_address" DROP CONSTRAINT "user_address_userId_fkey";

-- AlterTable
ALTER TABLE "user" DROP CONSTRAINT "user_pkey",
ADD COLUMN     "refreshTokren" TEXT,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "user_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "user_address" DROP CONSTRAINT "user_address_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "user_address_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "user_address" ADD CONSTRAINT "user_address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
