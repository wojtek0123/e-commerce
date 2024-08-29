/*
  Warnings:

  - The values [SHIP,COMPLETE] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `quantity` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('NEW', 'PROCESSING', 'SHIPPED', 'COMPLETED');
ALTER TABLE "OrderDetails" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "OrderDetails" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ("status"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "OrderStatus_old";
ALTER TABLE "OrderDetails" ALTER COLUMN "status" SET DEFAULT 'NEW';
COMMIT;

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "quantity" INTEGER NOT NULL;
