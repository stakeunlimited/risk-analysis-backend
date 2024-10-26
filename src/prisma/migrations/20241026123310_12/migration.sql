/*
  Warnings:

  - You are about to drop the `price_data` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "price_data" DROP CONSTRAINT "price_data_asset_id_fkey";

-- DropTable
DROP TABLE "price_data";

-- CreateTable
CREATE TABLE "PriceData" (
    "id" VARCHAR(36) NOT NULL,
    "priceUSD" DOUBLE PRECISION NOT NULL,
    "priceDate" TIMESTAMP(3) NOT NULL,
    "assetId" VARCHAR(36) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PriceData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PriceData" ADD CONSTRAINT "PriceData_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
