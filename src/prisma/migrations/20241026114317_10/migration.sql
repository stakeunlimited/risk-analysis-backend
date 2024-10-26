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
