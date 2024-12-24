/*
  Warnings:

  - You are about to drop the `Schedule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MatchToSchedule` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_user_id_fkey";

-- DropForeignKey
ALTER TABLE "_MatchToSchedule" DROP CONSTRAINT "_MatchToSchedule_A_fkey";

-- DropForeignKey
ALTER TABLE "_MatchToSchedule" DROP CONSTRAINT "_MatchToSchedule_B_fkey";

-- DropTable
DROP TABLE "Schedule";

-- DropTable
DROP TABLE "_MatchToSchedule";
