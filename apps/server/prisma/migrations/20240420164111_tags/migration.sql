-- CreateEnum
CREATE TYPE "Tag" AS ENUM ('NOWE', 'BESTSELLER', 'NADCHODZACE', 'PROMOCJE');

-- AlterTable
ALTER TABLE "book" ADD COLUMN     "tag" "Tag";
