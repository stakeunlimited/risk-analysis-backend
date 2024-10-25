-- CreateTable
CREATE TABLE "AssetOnPool" (
    "poolId" VARCHAR(36) NOT NULL,
    "assetId" VARCHAR(36) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssetOnPool_pkey" PRIMARY KEY ("poolId","assetId")
);

-- AddForeignKey
ALTER TABLE "AssetOnPool" ADD CONSTRAINT "AssetOnPool_poolId_fkey" FOREIGN KEY ("poolId") REFERENCES "Pool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetOnPool" ADD CONSTRAINT "AssetOnPool_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
