/*
  Warnings:

  - You are about to drop the column `firstName` on the `UserAddress` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `UserAddress` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `UserAddress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserAddress" DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "phone";

-- CreateTable
CREATE TABLE "UserInformation" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserInformation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserInformation" ADD CONSTRAINT "UserInformation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
