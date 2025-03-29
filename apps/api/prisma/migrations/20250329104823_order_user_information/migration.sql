/*
  Warnings:

  - You are about to drop the column `firstName` on the `OrderAddress` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `OrderAddress` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `OrderAddress` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderUserInformationId]` on the table `OrderDetails` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `OrderAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderUserInformationId` to the `OrderDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderAddress" DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "phone",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "OrderDetails" ADD COLUMN     "orderUserInformationId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "OrderUserInformation" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderUserInformation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrderDetails_orderUserInformationId_key" ON "OrderDetails"("orderUserInformationId");

-- AddForeignKey
ALTER TABLE "OrderDetails" ADD CONSTRAINT "OrderDetails_orderUserInformationId_fkey" FOREIGN KEY ("orderUserInformationId") REFERENCES "OrderUserInformation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
