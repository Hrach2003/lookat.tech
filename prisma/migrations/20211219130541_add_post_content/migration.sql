/*
  Warnings:

  - Added the required column `content` to the `post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "post" ADD COLUMN     "content" VARCHAR NOT NULL,
ADD COLUMN     "title" VARCHAR NOT NULL;
