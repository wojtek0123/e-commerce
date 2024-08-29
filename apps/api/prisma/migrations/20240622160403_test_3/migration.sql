/*
  Warnings:

  - You are about to drop the column `orderDetailsId` on the `PaymentDetails` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[paymentDetailsId]` on the table `OrderDetails` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `paymentDetailsId` to the `OrderDetails` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PaymentDetails" DROP CONSTRAINT "PaymentDetails_orderDetailsId_fkey";

-- DropIndex
DROP INDEX "OrderItem_orderDetailsId_key";

-- AlterTable
ALTER TABLE "OrderDetails" ADD COLUMN     "paymentDetailsId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PaymentDetails" DROP COLUMN "orderDetailsId";

-- CreateIndex
CREATE UNIQUE INDEX "OrderDetails_paymentDetailsId_key" ON "OrderDetails"("paymentDetailsId");

-- AddForeignKey
ALTER TABLE "OrderDetails" ADD CONSTRAINT "OrderDetails_paymentDetailsId_fkey" FOREIGN KEY ("paymentDetailsId") REFERENCES "PaymentDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;
