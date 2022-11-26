/*
  Warnings:

  - You are about to drop the column `bookId` on the `Genre` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Genre" DROP CONSTRAINT "Genre_bookId_fkey";

-- AlterTable
ALTER TABLE "Genre" DROP COLUMN "bookId";

-- CreateTable
CREATE TABLE "GenreOnBook" (
    "bookID" TEXT NOT NULL,
    "genreID" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GenreOnBook_pkey" PRIMARY KEY ("bookID","genreID")
);

-- AddForeignKey
ALTER TABLE "GenreOnBook" ADD CONSTRAINT "GenreOnBook_bookID_fkey" FOREIGN KEY ("bookID") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenreOnBook" ADD CONSTRAINT "GenreOnBook_genreID_fkey" FOREIGN KEY ("genreID") REFERENCES "Genre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
