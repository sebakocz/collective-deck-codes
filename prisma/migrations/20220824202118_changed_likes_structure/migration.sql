/*
  Warnings:

  - You are about to drop the column `likes` on the `Deck` table. All the data in the column will be lost.
  - You are about to drop the column `views` on the `Deck` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Deck" DROP COLUMN "likes",
DROP COLUMN "views";

-- CreateTable
CREATE TABLE "FavouriteDecksOnUsers" (
    "userId" TEXT NOT NULL,
    "deckId" TEXT NOT NULL,

    CONSTRAINT "FavouriteDecksOnUsers_pkey" PRIMARY KEY ("userId","deckId")
);

-- AddForeignKey
ALTER TABLE "FavouriteDecksOnUsers" ADD CONSTRAINT "FavouriteDecksOnUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavouriteDecksOnUsers" ADD CONSTRAINT "FavouriteDecksOnUsers_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
