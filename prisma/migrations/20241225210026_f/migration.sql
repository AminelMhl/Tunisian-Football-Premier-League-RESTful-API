/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `FantasyTeam` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FantasyTeam_userId_key" ON "FantasyTeam"("userId");
