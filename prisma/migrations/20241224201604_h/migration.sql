/*
  Warnings:

  - You are about to drop the column `goals_against` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `goals_for` on the `Match` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "goals_against",
DROP COLUMN "goals_for",
ADD COLUMN     "awayGoals" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "homeGoals" INTEGER NOT NULL DEFAULT 0;
