import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Asset } from './interfaces/asset.interface';
import { CreateAssetDto } from './dto/asset.dto';

@Injectable()
export class AssetService {
    constructor(@Inject('ASSET_MODEL') private readonly assetModel: Model<Asset>) {}

  async create(createCatDto: CreateAssetDto): Promise<Asset> {
    const createdCat = this.assetModel.create(createCatDto);
    return createdCat;
  }

  async findAll(): Promise<Asset[]> {
    return this.assetModel.find().exec();
  }
}
