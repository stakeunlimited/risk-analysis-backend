import { Module } from '@nestjs/common';
import { AssetService } from './asset.service';
import { AssetController } from './asset.controller';
import { DatabaseModule } from 'src/database/database.module';
import { assetProviders } from './asset.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [AssetController],
  providers: [AssetService, ...assetProviders],
})
export class AssetModule {}
