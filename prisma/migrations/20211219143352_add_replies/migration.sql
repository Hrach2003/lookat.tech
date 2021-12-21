/*
  Warnings:

  - You are about to drop the `_replies` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_replies" DROP CONSTRAINT "_replies_A_fkey";

-- DropForeignKey
ALTER TABLE "_replies" DROP CONSTRAINT "_replies_B_fkey";

-- DropTable
DROP TABLE "_replies";

-- CreateTable
CREATE TABLE "reply" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message" VARCHAR(200) NOT NULL,
    "commenterId" INTEGER NOT NULL,
    "commentId" INTEGER NOT NULL,

    CONSTRAINT "reply_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reply" ADD CONSTRAINT "reply_commenterId_fkey" FOREIGN KEY ("commenterId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reply" ADD CONSTRAINT "reply_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
