/*
  Warnings:

  - You are about to drop the column `provider` on the `PaymentDetails` table. All the data in the column will be lost.
  - Added the required column `method` to the `PaymentDetails` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('DEBIT_CARD', 'SIX_DIGIT_NUMBER');

-- AlterTable
ALTER TABLE "PaymentDetails" DROP COLUMN "provider",
ADD COLUMN     "method" "PaymentMethod" NOT NULL;

-- DropEnum
DROP TYPE "Provider";
