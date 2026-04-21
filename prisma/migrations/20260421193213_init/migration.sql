/*
  Warnings:

  - The primary key for the `book_authors` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `category_id` on the `book_authors` table. All the data in the column will be lost.
  - You are about to drop the column `publication_time` on the `books` table. All the data in the column will be lost.
  - Added the required column `author_id` to the `book_authors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publication_year` to the `books` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "book_authors" DROP CONSTRAINT "book_authors_category_id_fkey";

-- AlterTable
ALTER TABLE "book_authors" DROP CONSTRAINT "book_authors_pkey",
DROP COLUMN "category_id",
ADD COLUMN     "author_id" INTEGER NOT NULL,
ADD CONSTRAINT "book_authors_pkey" PRIMARY KEY ("book_id", "author_id");

-- AlterTable
ALTER TABLE "books" DROP COLUMN "publication_time",
ADD COLUMN     "publication_year" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "book_authors" ADD CONSTRAINT "book_authors_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "authors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
