/*
  Warnings:

  - You are about to drop the column `tvl` on the `Asset` table. All the data in the column will be lost.
  - Added the required column `dateLaunched` to the `Asset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `marketCapUSD` to the `Asset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Asset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "tvl",
ADD COLUMN     "dateLaunched" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "marketCapUSD" INTEGER NOT NULL,
ADD COLUMN     "name" VARCHAR(255) NOT NULL;
