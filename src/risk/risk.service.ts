import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Asset } from '@prisma/client';

@Injectable()
export class RiskService {
  constructor(private readonly prisma: PrismaService) {}

  async getAssetsRisk() {
    const assets = await this.prisma.asset.findMany();
    const maturityRisk = this.maturityRisk(assets);
    console.log({ maturityRisk: maturityRisk.map((mr) => mr.risk) });
    const marketCapRisk = this.marketCapRisk(assets);
    console.log({ marketCapRisk: marketCapRisk.map((mc) => mc.risk) });

    return maturityRisk.map((mr, i) => ({
      ...mr,
      marketCapUSD: mr.marketCapUSD.toString(),
      risk: (mr.risk * marketCapRisk[i].risk) / 2,
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
