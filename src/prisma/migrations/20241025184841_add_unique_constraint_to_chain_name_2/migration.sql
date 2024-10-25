/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Chain` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[symbol]` on the table `Chain` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Platform_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Chain_name_key" ON "Chain"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Chain_symbol_key" ON "Chain"("symbol");
