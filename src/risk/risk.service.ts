import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Asset, Chain, Platform, Pool } from '@prisma/client';

@Injectable()
export class RiskService {
  constructor(private readonly prisma: PrismaService) {}

  async getTotalPoolRisk(poolAddress: string) {
    // Find the pool by its unique address
    const pool = await this.prisma.pool.findUnique({
      where: { address: poolAddress },
    });
    if (!pool) throw new Error('Pool not found');

    const platform = await this.prisma.platform.findUnique({
      where: { id: pool.platformId },
      include: { chain: true },
    });

    // Retrieve risks for chain, protocol, and pool
    const chainRisk = (await this.getChainsRisk()).find(
      (chain) => chain.id === platform.chain.id,
    ).risks.total;
    const protocolRisk = (await this.getProtocolsRisk()).find(
      (protocol) => protocol.id === pool.platformId,
    ).risks.total;
    const poolRisk = (await this.getPoolsRisk()).find(
      (p) => p.address === poolAddress,
    ).risks.total;

    const poolAssets = await this.prisma.assetOnPool.findMany({
      where: { poolId: pool.id },
      include: { asset: true },
    });

    // Calculate the average risk of assets associated with the pool
    const assetRisks = (await this.getAssetsRisk())
      .filter((assetRisk) =>
        poolAssets.some((pa) => pa.assetId === assetRisk.id),
      )
      .map((assetRisk) => assetRisk.risks.total);
    const avgAssetRisk = assetRisks.length
      ? assetRisks.reduce((sum, risk) => sum + risk, 0) / assetRisks.length
      : 0;

    // Define weights for the total risk calculation
    const weights = { chain: 0.25, protocol: 0.25, pool: 0.3, assets: 0.2 };

    const totalRisk =
      chainRisk * weights.chain +
      protocolRisk * weights.protocol +
      poolRisk * weights.pool +
      avgAssetRisk * weights.assets;

    return {
      poolAddress,
      risks: { chainRisk, protocolRisk, poolRisk, avgAssetRisk, totalRisk },
    };
  }

  ////////////////
  // CHAIN RISK //
  ////////////////

  async getChainsRisk() {
    const chains = await this.prisma.chain.findMany();
    const maturityRisk = this.maturityRiskChains(chains);
    console.log({ maturityRisk: maturityRisk.map((mr) => mr.risk) });
    const marketCapRisk = this.marketCapRiskChains(chains);
    console.log({ marketCapRisk: marketCapRisk.map((mc) => mc.risk) });

    // Maturity | 0.6
    // MarketCap | 0.4
    const weights = {
      maturity: 0.6,
      marketCap: 0.4,
    };

    return maturityRisk.map((mr, i) => ({
      ...mr,
      marketCapUSD: mr.marketCapUSD.toString(),
      risks: {
        maturity: mr.risk,
        marketCap: marketCapRisk[i].risk,
        total:
          (mr.risk * weights.maturity +
            marketCapRisk[i].risk * weights.marketCap) /
          (weights.maturity + weights.marketCap),
      },
    }));
  }

  // 5 | < 1 year
  // 4 | 1 - 2 years
  // 3 | 2 - 4 years
  // 2 | 4 - 6 years
  // 1 | > 6 years
  private maturityRiskChains(chains: Chain[]) {
    const now = new Date().getTime();
    const msInAYear = 1000 * 60 * 60 * 24 * 365;

    return chains.map((chain) => {
      if (!chain.dateLaunched) return { ...chain, risk: 5 }; // Default high risk if no date

      const ageInYears = (now - chain.dateLaunched.getTime()) / msInAYear;

      if (ageInYears < 1) return { ...chain, risk: 5 };
      else if (ageInYears < 2) return { ...chain, risk: 4 };
      else if (ageInYears < 4) return { ...chain, risk: 3 };
      else if (ageInYears < 6) return { ...chain, risk: 2 };
      else return { ...chain, risk: 1 };
    });
  }

  // 5 | < 500M
  // 4 | 500M - 2B
  // 3 | 2B - 10B
  // 2 | 10B - 50B
  // 1 | > 50B
  private marketCapRiskChains(chains: Chain[]) {
    return chains.map((chain) => {
      if (chain.marketCapUSD < 500000000) return { ...chain, risk: 5 };
      else if (chain.marketCapUSD < 2000000000) return { ...chain, risk: 4 };
      else if (chain.marketCapUSD < 10000000000) return { ...chain, risk: 3 };
      else if (chain.marketCapUSD < 50000000000) return { ...chain, risk: 2 };
      else return { ...chain, risk: 1 };
    });
  }

  ///////////////////
  // PROTOCOL RISK //
  ///////////////////

  async getProtocolsRisk() {
    const protocols = await this.prisma.platform.findMany();
    const tvlRisk = this.tvlRiskProtocols(protocols);
    console.log({ tvlRisk: tvlRisk.map((tr) => tr.risk) });
    const maturityRisk = this.maturityRiskProtocols(protocols);
    console.log({ maturityRisk: maturityRisk.map((mr) => mr.risk) });

    // Maturity | 0.4
    // TVL      | 0.6
    const weights = {
      tvl: 0.6,
      maturity: 0.4,
    };

    return maturityRisk.map((mr, i) => ({
      ...mr,
      tvlUSD: mr.tvlUSD.toString(),
      risks: {
        tvl: tvlRisk[i].risk,
        maturity: mr.risk,
        total:
          (tvlRisk[i].risk * weights.tvl + mr.risk * weights.maturity) /
          (weights.tvl + weights.maturity),
      },
    }));
  }

  // 5 | < 10M
  // 4 | 10M - 100M
  // 3 | 100M - 500M
  // 2 | 500M - 1B
  // 1 | > 1B
  private tvlRiskProtocols(protocols: Platform[]) {
    return protocols.map((protocol) => {
      if (protocol.tvlUSD < 10000000) return { ...protocol, risk: 5 };
      else if (protocol.tvlUSD < 100000000) return { ...protocol, risk: 4 };
      else if (protocol.tvlUSD < 500000000) return { ...protocol, risk: 3 };
      else if (protocol.tvlUSD < 1000000000) return { ...protocol, risk: 2 };
      else return { ...protocol, risk: 1 };
    });
  }

  // 5 | < 6 months
  // 4 | 6 months - 1 year
  // 3 | 1 year - 2 years
  // 2 | 2 years - 3 years
  // 1 | > 3 years
  private maturityRiskProtocols(protocols: Platform[]) {
    const now = new Date().getTime();
    const msInAMonth = 1000 * 60 * 60 * 24 * 30;

    return protocols.map((protocol) => {
      if (!protocol.dateLaunched) return { ...protocol, risk: 5 }; // Default high risk if no date

      const ageInMonths = (now - protocol.dateLaunched.getTime()) / msInAMonth;

      if (ageInMonths < 6) return { ...protocol, risk: 5 };
      else if (ageInMonths < 12) return { ...protocol, risk: 4 };
      else if (ageInMonths < 24) return { ...protocol, risk: 3 };
      else if (ageInMonths < 36) return { ...protocol, risk: 2 };
      else return { ...protocol, risk: 1 };
    });
  }

  ///////////////
  // POOL RISK //
  ///////////////

  async getPoolsRisk() {
    const pools = await this.prisma.pool.findMany();
    const tvlRisk = this.tvlRisk(pools);
    console.log({ tvlRisk: tvlRisk.map((tr) => tr.risk) });
    const maturityRisk = this.maturityRiskPools(pools);
    console.log({ maturityRisk: maturityRisk.map((mr) => mr.risk) });

    // Maturity | 0.3
    // TVL      | 0.7
    const weights = {
      tvl: 0.7,
      maturity: 0.3,
    };

    return maturityRisk.map((mr, i) => ({
      ...mr,
      tvlUSD: mr.tvlUSD.toString(),
      risks: {
        tvl: tvlRisk[i].risk,
        maturity: mr.risk,
        total:
          (tvlRisk[i].risk * weights.tvl + mr.risk * weights.maturity) /
          (weights.tvl + weights.maturity),
      },
    }));
  }

  // 5 | < 50M
  // 4 | 50M - 500M
  // 3 | 500M - 1B
  // 2 | 1B - 5B
  // 1 | > 5B
  private tvlRisk(pools: Pool[]) {
    return pools.map((pool) => {
      if (pool.tvlUSD < 50000000) return { ...pool, risk: 5 };
      else if (pool.tvlUSD < 500000000) return { ...pool, risk: 4 };
      else if (pool.tvlUSD < 1000000000) return { ...pool, risk: 3 };
      else if (pool.tvlUSD < 10000000000) return { ...pool, risk: 2 };
      else return { ...pool, risk: 1 };
    });
  }

  // 5 | < 3 months
  // 4 | 3 - 9 months
  // 3 | 9 - 15 months
  // 2 | 15 - 30 months
  // 1 | > 30 months
  private maturityRiskPools(pools: Pool[]) {
    const now = new Date().getTime();
    const msInAMonth = 1000 * 60 * 60 * 24 * 30;

    return pools.map((pool) => {
      if (!pool.dateLaunched) return { ...pool, risk: 5 }; // Default high risk if no date

      const ageInMonths = (now - pool.dateLaunched.getTime()) / msInAMonth;

      if (ageInMonths < 3) return { ...pool, risk: 5 };
      else if (ageInMonths < 9) return { ...pool, risk: 4 };
      else if (ageInMonths < 15) return { ...pool, risk: 3 };
      else if (ageInMonths < 30) return { ...pool, risk: 2 };
      else return { ...pool, risk: 1 };
    });
  }

  ////////////////
  // ASSET RISK //
  ////////////////

  async getAssetsRisk() {
    const assets = await this.prisma.asset.findMany();
    const maturityRisk = this.maturityRiskAssets(assets);
    console.log({ maturityRisk: maturityRisk.map((mr) => mr.risk) });
    const marketCapRisk = this.marketCapRiskAssets(assets);
    console.log({ marketCapRisk: marketCapRisk.map((mc) => mc.risk) });

    const weights = {
      maturity: 0.55,
      marketCap: 0.45,
    };

    return maturityRisk.map((mr, i) => ({
      ...mr,
      marketCapUSD: mr.marketCapUSD.toString(),
      risks: {
        maturity: mr.risk,
        marketCap: marketCapRisk[i].risk,
        total:
          (mr.risk * weights.maturity +
            marketCapRisk[i].risk * weights.marketCap) /
          (weights.maturity + weights.marketCap),
      },
    }));
  }

  // Age in years
  // 5 | < 1 year
  // 4 | 1 - 2 years
  // 3 | 2 - 3 years
  // 2 | 3 - 5 years
  // 1 | > 5 years
  private maturityRiskAssets(assets: Asset[]) {
    const now = new Date().getTime();
    const msInAYear = 1000 * 60 * 60 * 24 * 365;

    return assets.map((asset) => {
      if (!asset.dateLaunched) return { ...asset, risk: 5 }; // Default high risk if no date

      const ageInYears = (now - asset.dateLaunched.getTime()) / msInAYear;

      if (ageInYears < 1) return { ...asset, risk: 5 };
      else if (ageInYears < 2) return { ...asset, risk: 4 };
      else if (ageInYears < 3) return { ...asset, risk: 3 };
      else if (ageInYears < 5) return { ...asset, risk: 2 };
      else return { ...asset, risk: 1 };
    });
  }

  // 5 | < 50M
  // 4 | 50M - 500M
  // 3 | 500M - 1B
  // 2 | 1B - 10B
  // 1 | > 10B
  private marketCapRiskAssets(assets: Asset[]) {
    return assets.map((asset) => {
      if (asset.marketCapUSD < 50000000) return { ...asset, risk: 5 };
      else if (asset.marketCapUSD < 500000000) return { ...asset, risk: 4 };
      else if (asset.marketCapUSD < 1000000000) return { ...asset, risk: 3 };
      else if (asset.marketCapUSD < 10000000000) return { ...asset, risk: 2 };
      else return { ...asset, risk: 1 };
    });
  }
}
