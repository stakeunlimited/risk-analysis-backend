import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as csv from 'csv-parser';

@Injectable()
export class AssetService {
  //   async findAll(): Promise<Asset[]> {
  //     return this.assetModel.find().exec();
  //   }

  constructor(private readonly prisma: PrismaService) {}

  async getAllTokensData() {
    const data = await axios.get(
      'https://pro-api.coinmarketcap.com/v2/cryptocurrency/info',
      {
        headers: {
          'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY,
        },
      },
    );
    return data.data;
  }

  async getChainsData() {
    const data = await axios.get(
      'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
      //   'https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?symbol=ETH,BSC,SOL,AVAX,MATIC,FTM,DOT,ADA,ALGO,CELO,ARB',
      {
        headers: {
          'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY,
        },
      },
    );
    return data.data;
  }

  async getTokenInfo(id: string) {
    const data = await axios.get(
      `https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?id=${id}`,
      {
        headers: {
          'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY,
        },
      },
    );
    return data.data;
  }

  async loadPoolsFromCSV(filePath: string) {
    const pools = [];

    return new Promise<void>((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          pools.push(row);
        })
        .on('end', async () => {
          await this.processPoolsData(pools);
          resolve();
        })
        .on('error', (error) => reject(error));
    });
  }

  async processPoolsData(pools: any[]) {
    for (const pool of pools) {
      const chain = await this.prisma.chain.upsert({
        where: { symbol: pool.chainSymbol }, // Ensure symbol is unique
        update: {},
        create: {
          name: pool.chain,
          symbol: pool.chainSymbol,
        },
      });

      const platform = await this.prisma.platform.upsert({
        where: { name: pool.name }, // Use id or a unique identifier
        update: {},
        create: {
          name: pool.protocolVersion,
          chainId: chain.id,
          tvlUSD: BigInt(pool.totalLiquidity_value),
        },
      });

      const poolData = await this.prisma.pool.upsert({
        where: { address: pool.id },
        update: {},
        create: {
          name: `${pool.token0_symbol}-${pool.token1_symbol}`,
          address: pool.id,
          tvlUSD: BigInt(pool.totalLiquidity_value),
          platformId: platform.id,
        },
      });

      const asset0 = await this.prisma.asset.upsert({
        where: { symbol: pool.token0_symbol },
        update: {},
        create: {
          name: pool.token0_name,
          symbol: pool.token0_symbol,
          marketCapUSD: BigInt(pool.token0_fullyDilutedValuation_value),
        },
      });

      const asset1 = await this.prisma.asset.upsert({
        where: { symbol: pool.token1_symbol },
        update: {},
        create: {
          name: pool.token1_name,
          symbol: pool.token1_symbol,
          marketCapUSD: BigInt(pool.token1_fullyDilutedValuation_value),
        },
      });

      await this.prisma.assetOnPool.create({
        data: {
          poolId: poolData.id,
          assetId: asset0.id,
        },
      });

      await this.prisma.assetOnPool.create({
        data: {
          poolId: poolData.id,
          assetId: asset1.id,
        },
      });
    }
  }

  async execute() {
    const data = [];
    await this.prisma.chain.createMany({ data });
  }
}
