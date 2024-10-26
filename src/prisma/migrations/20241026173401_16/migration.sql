/*
  Warnings:

  - The primary key for the `VolatilityData` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `VolatilityData` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "VolatilityData" DROP CONSTRAINT "VolatilityData_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "VolatilityData_pkey" PRIMARY KEY ("assetId", "date");
