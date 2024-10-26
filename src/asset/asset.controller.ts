import { Controller, Get, Post, Query } from '@nestjs/common';
import { AssetService } from './asset.service';
@Controller('asset')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Get('volatility-data')
  async getVolatilityData(@Query() { symbol }: { symbol: string }) {
    return this.assetService.getVolatilityData(symbol);
  }

  //////////////////////
  // EXPERIMENTS ZONE //
  //////////////////////

  @Get()
  async getAllTokensData() {
    return this.assetService.getAllTokensData();
  }

  @Get('chains')
  async getChainsData() {
    return this.assetService.getChainsData();
  }

  @Post('execute')
  async execute() {
    return this.assetService.execute();
  }
}
