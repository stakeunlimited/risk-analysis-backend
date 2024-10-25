import { Controller, Get, Post } from '@nestjs/common';
import { AssetService } from './asset.service';
@Controller('asset')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post('execute')
  async execute() {
    return this.assetService.execute();
  }

  @Get()
  async getAllTokensData() {
    return this.assetService.getAllTokensData();
  }
}
