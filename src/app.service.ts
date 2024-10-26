import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  getApiInfo(): string {
    return 'This is the DeFi Security API. Use the /risk and /openai endpoints to access the risk and OpenAI services.';
  }

  async getAllPools() {
    const pools = await this.prisma.pool.findMany({
      include: {
        platform: {
          include: {
            chain: true,
          },
        },
        assets: {
          include: {
            asset: true,
          },
        },
      },
    });
    const poolsProcessed = pools.map((pool) => ({
      ...pool,
      tvlUSD: pool.tvlUSD.toString(),
      platform: {
        ...pool.platform,
        tvlUSD: pool.platform.tvlUSD.toString(),
        chain: {
          ...pool.platform.chain,
          marketCapUSD: pool.platform.chain.marketCapUSD.toString(),
        },
      },
      assets: pool.assets.map((asset) => ({
        ...asset,
        asset: {
          ...asset.asset,
          marketCapUSD: asset.asset.marketCapUSD.toString(),
        },
      })),
    }));
    console.log(poolsProcessed);

    return poolsProcessed;
    // return pools.map((pool) => ({ ...pool, platform: pool.platform.name }));
  }
}
