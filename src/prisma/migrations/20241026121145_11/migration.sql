/*
  Warnings:

  - You are about to drop the `PriceData` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PriceData" DROP CONSTRAINT "PriceData_assetId_fkey";

-- DropTable
DROP TABLE "PriceData";

-- CreateTable
CREATE TABLE "price_data" (
    "id" VARCHAR(36) NOT NULL,
    "price_usd" DOUBLE PRECISION NOT NULL,
    "price_date" TIMESTAMP(3) NOT NULL,
    "asset_id" VARCHAR(36) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "price_data_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "price_data" ADD CONSTRAINT "price_data_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
