-- CreateTable
CREATE TABLE "VolatilityData" (
    "id" VARCHAR(36) NOT NULL,
    "assetId" VARCHAR(36) NOT NULL,
    "symbol" VARCHAR(10) NOT NULL,
    "date" DATE NOT NULL,
    "open" DECIMAL(65,30) NOT NULL,
    "high" DECIMAL(65,30) NOT NULL,
    "low" DECIMAL(65,30) NOT NULL,
    "close" DECIMAL(65,30) NOT NULL,
    "volatility" DECIMAL(65,30) NOT NULL,
    "kurtosis" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VolatilityData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VolatilityData" ADD CONSTRAINT "VolatilityData_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
