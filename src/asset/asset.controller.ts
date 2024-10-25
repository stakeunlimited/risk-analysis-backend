import { Controller, Get, Post } from '@nestjs/common';
import { AssetService } from './asset.service';
@Controller('asset')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

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
