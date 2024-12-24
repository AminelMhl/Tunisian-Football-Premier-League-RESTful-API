/*
  Warnings:

  - You are about to drop the `Leaderboard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserPlayer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserTeam` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Leaderboard" DROP CONSTRAINT "Leaderboard_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserPlayer" DROP CONSTRAINT "UserPlayer_playerId_fkey";

-- DropForeignKey
ALTER TABLE "UserPlayer" DROP CONSTRAINT "UserPlayer_userTeamId_fkey";

-- DropForeignKey
ALTER TABLE "UserTeam" DROP CONSTRAINT "UserTeam_userId_fkey";

-- DropTable
DROP TABLE "Leaderboard";

-- DropTable
DROP TABLE "UserPlayer";

-- DropTable
DROP TABLE "UserTeam";
