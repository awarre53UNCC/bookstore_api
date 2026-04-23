/*
  Warnings:

  - A unique constraint covering the columns `[full_name]` on the table `authors` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "authors_full_name_key" ON "authors"("full_name");
