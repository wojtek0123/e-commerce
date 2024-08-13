/*
  Warnings:

  - You are about to drop the `cart_item` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `discount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order_details` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payment_details` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_inventory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `shopping_session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_payment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "cart_item" DROP CONSTRAINT "cart_item_shoppingSessionId_fkey";

-- DropForeignKey
ALTER TABLE "order_details" DROP CONSTRAINT "order_details_paymentDetailsId_fkey";

-- DropForeignKey
ALTER TABLE "order_details" DROP CONSTRAINT "order_details_userId_fkey";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_orderId_fkey";

-- DropForeignKey
ALTER TABLE "shopping_session" DROP CONSTRAINT "shopping_session_userId_fkey";

-- DropForeignKey
ALTER TABLE "user_payment" DROP CONSTRAINT "user_payment_userId_fkey";

-- DropTable
DROP TABLE "cart_item";

-- DropTable
DROP TABLE "discount";

-- DropTable
DROP TABLE "order_details";

-- DropTable
DROP TABLE "order_items";

-- DropTable
DROP TABLE "payment_details";

-- DropTable
DROP TABLE "product_category";

-- DropTable
DROP TABLE "product_inventory";

-- DropTable
DROP TABLE "shopping_session";

-- DropTable
DROP TABLE "user_payment";
