/*
  Warnings:

  - You are about to drop the column `tvlUSD` on the `Chain` table. All the data in the column will be lost.
  - Added the required column `marketCapUSD` to the `Chain` table without a default value. This is not possible if the table is not empty.
  - Added the required column `symbol` to the `Chain` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chain" DROP COLUMN "tvlUSD",
ADD COLUMN     "marketCapUSD" BIGINT NOT NULL,
ADD COLUMN     "symbol" VARCHAR(10) NOT NULL;
