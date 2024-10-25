-- CreateTable
CREATE TABLE "Asset" (
    "id" VARCHAR(36) NOT NULL,
    "symbol" VARCHAR(10) NOT NULL,
    "tvl" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);
