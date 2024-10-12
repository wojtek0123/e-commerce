/*
  Warnings:

  - Changed the type of `provider` on the `PaymentDetails` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('DEBIT_CARD', 'SIX_DIGIT_NUMBER');

-- AlterTable
ALTER TABLE "PaymentDetails" DROP COLUMN "provider",
ADD COLUMN     "provider" "Provider" NOT NULL;
