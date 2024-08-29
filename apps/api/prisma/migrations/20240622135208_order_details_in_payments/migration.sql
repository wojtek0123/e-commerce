/*
  Warnings:

  - You are about to drop the column `paymentDetailsId` on the `OrderDetails` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderDetailsId]` on the table `PaymentDetails` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderDetailsId` to the `PaymentDetails` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OrderDetails" DROP CONSTRAINT "OrderDetails_paymentDetailsId_fkey";

-- DropIndex
DROP INDEX "OrderDetails_paymentDetailsId_key";

-- AlterTable
ALTER TABLE "OrderDetails" DROP COLUMN "paymentDetailsId";

-- AlterTable
ALTER TABLE "PaymentDetails" ADD COLUMN     "orderDetailsId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PaymentDetails_orderDetailsId_key" ON "PaymentDetails"("orderDetailsId");

-- AddForeignKey
ALTER TABLE "PaymentDetails" ADD CONSTRAINT "PaymentDetails_orderDetailsId_fkey" FOREIGN KEY ("orderDetailsId") REFERENCES "OrderDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
