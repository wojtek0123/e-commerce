-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('NEW', 'PROCESSING', 'SHIP', 'COMPLETE');

-- AlterTable
ALTER TABLE "OrderDetails" ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'NEW';
