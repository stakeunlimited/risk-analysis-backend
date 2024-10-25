import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../../prisma/prisma.service';

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

  async execute() {
    const data = [
      {
        name: 'Tether USDt',
        symbol: 'USDT',
        marketCapUSD: 120258305917,
        dateLaunched: new Date('2014-10-06T00:00:00.000Z'),
      },
      {
        name: 'USDC',
        symbol: 'USDC',
        marketCapUSD: 34424178344,
        dateLaunched: new Date('2018-09-26T00:00:00.000Z'),
      },
      {
        name: 'Dai',
        symbol: 'DAI',
        marketCapUSD: 5364769716,
        dateLaunched: new Date('2017-12-18T00:00:00.000Z'),
      },
      {
        name: 'First Digital USD',
        symbol: 'FDUSD',
        marketCapUSD: 2626066119,
        dateLaunched: new Date('2020-05-01T00:00:00.000Z'),
      },
      {
        name: 'USDD',
        symbol: 'USDD',
        marketCapUSD: 757687642,
        dateLaunched: new Date('2020-08-18T00:00:00.000Z'),
      },
    ];

    await this.prisma.asset.createMany({ data });
  }
}
