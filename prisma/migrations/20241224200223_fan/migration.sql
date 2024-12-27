/*
  Warnings:

  - You are about to drop the `UserTeam` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserTeamPlayers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserTeam" DROP CONSTRAINT "UserTeam_userId_fkey";

-- DropForeignKey
ALTER TABLE "_UserTeamPlayers" DROP CONSTRAINT "_UserTeamPlayers_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserTeamPlayers" DROP CONSTRAINT "_UserTeamPlayers_B_fkey";

-- DropTable
DROP TABLE "UserTeam";

-- DropTable
DROP TABLE "_UserTeamPlayers";

-- CreateTable
CREATE TABLE "FantasyTeam" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "FantasyTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FantasyTeamPlayers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_FantasyTeamPlayers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_FantasyTeamPlayers_B_index" ON "_FantasyTeamPlayers"("B");

-- AddForeignKey
ALTER TABLE "FantasyTeam" ADD CONSTRAINT "FantasyTeam_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FantasyTeamPlayers" ADD CONSTRAINT "_FantasyTeamPlayers_A_fkey" FOREIGN KEY ("A") REFERENCES "FantasyTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FantasyTeamPlayers" ADD CONSTRAINT "_FantasyTeamPlayers_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
