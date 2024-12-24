/*
  Warnings:

  - You are about to drop the column `away_score` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `home_score` on the `Match` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "away_score",
DROP COLUMN "home_score",
ADD COLUMN     "goals_against" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "goals_for" INTEGER NOT NULL DEFAULT 0;
