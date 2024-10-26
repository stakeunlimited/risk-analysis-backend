import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Asset, Pool } from '@prisma/client';

@Injectable()
export class RiskService {
  constructor(private readonly prisma: PrismaService) {}

  ///////////////
  // POOL RISK //
  ///////////////

  async getPoolsRisk() {
    const pools = await this.prisma.pool.findMany();
    const tvlRisk = this.tvlRisk(pools);
    console.log({ tvlRisk: tvlRisk.map((tr) => tr.risk) });
    const maturityRisk = this.maturityRiskPools(pools);
    console.log({ maturityRisk: maturityRisk.map((mr) => mr.risk) });

    const weights = {
      tvl: 0.4,
      maturity: 0.6,
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
    const maturityRisk = this.maturityRisk(assets);
    console.log({ maturityRisk: maturityRisk.map((mr) => mr.risk) });
    const marketCapRisk = this.marketCapRisk(assets);
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
  private maturityRisk(assets: Asset[]) {
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
  private marketCapRisk(assets: Asset[]) {
    return assets.map((asset) => {
      if (asset.marketCapUSD < 50000000) return { ...asset, risk: 5 };
      else if (asset.marketCapUSD < 500000000) return { ...asset, risk: 4 };
      else if (asset.marketCapUSD < 1000000000) return { ...asset, risk: 3 };
      else if (asset.marketCapUSD < 10000000000) return { ...asset, risk: 2 };
      else return { ...asset, risk: 1 };
    });
  }
}
