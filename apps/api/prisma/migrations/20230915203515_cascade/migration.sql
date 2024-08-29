-- DropForeignKey
ALTER TABLE "book_author" DROP CONSTRAINT "book_author_authorId_fkey";

-- DropForeignKey
ALTER TABLE "book_author" DROP CONSTRAINT "book_author_bookId_fkey";

-- AddForeignKey
ALTER TABLE "book_author" ADD CONSTRAINT "book_author_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "book_author" ADD CONSTRAINT "book_author_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "author"("id") ON DELETE CASCADE ON UPDATE CASCADE;
