/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Manager` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Manager_name_key" ON "Manager"("name");
