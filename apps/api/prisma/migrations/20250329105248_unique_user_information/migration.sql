/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `UserInformation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserInformation_userId_key" ON "UserInformation"("userId");
