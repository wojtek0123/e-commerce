/*
  Warnings:

  - You are about to drop the column `coverImagePath` on the `Book` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "coverImagePath",
ADD COLUMN     "favouriteBooksListId" TEXT,
ALTER COLUMN "coverImage" SET DEFAULT 'https://wialcudrcfkznrlcooal.supabase.co/storage/v1/object/sign/image-covers/not-found.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZS1jb3ZlcnMvbm90LWZvdW5kLnBuZyIsImlhdCI6MTczNDk2OTQzOCwiZXhwIjo0ODg4NTY5NDM4fQ.vJne2LtJc42hsss3q_TF3ey-8KoXKnzYvZIFq_CaXB8&t=2024-12-23T15%3A57%3A18.203Z';

-- CreateTable
CREATE TABLE "FavouriteBooksList" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FavouriteBooksList_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FavouriteBooksList_userId_key" ON "FavouriteBooksList"("userId");

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_favouriteBooksListId_fkey" FOREIGN KEY ("favouriteBooksListId") REFERENCES "FavouriteBooksList"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavouriteBooksList" ADD CONSTRAINT "FavouriteBooksList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
