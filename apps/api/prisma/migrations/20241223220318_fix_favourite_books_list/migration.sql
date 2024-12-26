/*
  Warnings:

  - You are about to drop the column `favouriteBooksListId` on the `Book` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Book" DROP CONSTRAINT "Book_favouriteBooksListId_fkey";

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "favouriteBooksListId";

-- CreateTable
CREATE TABLE "_BookToFavouriteBooksList" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BookToFavouriteBooksList_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_BookToFavouriteBooksList_B_index" ON "_BookToFavouriteBooksList"("B");

-- AddForeignKey
ALTER TABLE "_BookToFavouriteBooksList" ADD CONSTRAINT "_BookToFavouriteBooksList_A_fkey" FOREIGN KEY ("A") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookToFavouriteBooksList" ADD CONSTRAINT "_BookToFavouriteBooksList_B_fkey" FOREIGN KEY ("B") REFERENCES "FavouriteBooksList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
