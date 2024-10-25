/*
  Warnings:

  - You are about to drop the column `name` on the `Pool` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Platform` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Pool" DROP COLUMN "name";

-- CreateIndex
CREATE UNIQUE INDEX "Platform_name_key" ON "Platform"("name");
