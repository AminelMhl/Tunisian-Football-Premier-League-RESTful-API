/*
  Warnings:

  - A unique constraint covering the columns `[userName,email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_userName_key";

-- DropIndex
DROP INDEX "User_email_key";

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_email_key" ON "User"("userName", "email");
