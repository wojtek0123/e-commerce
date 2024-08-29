-- DropForeignKey
ALTER TABLE "PaymentDetails" DROP CONSTRAINT "PaymentDetails_orderDetailsId_fkey";

-- AddForeignKey
ALTER TABLE "PaymentDetails" ADD CONSTRAINT "PaymentDetails_orderDetailsId_fkey" FOREIGN KEY ("orderDetailsId") REFERENCES "OrderDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
