import { Body, Controller, Get, Post } from '@nestjs/common';
import { AssetService } from './asset.service';
import { CreateAssetDto } from './dto/asset.dto';
import { Asset } from './interfaces/asset.interface';

@Controller('asset')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post()
  async create(@Body() addAssetDto: CreateAssetDto) {
    return this.assetService.create(addAssetDto);
  }

  @Get()
  async findAll(): Promise<Asset[]> {
    return this.assetService.findAll();
  }
}
