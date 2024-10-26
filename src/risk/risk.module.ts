import { Module } from '@nestjs/common';
import { RiskService } from './risk.service';
import { RiskController } from './risk.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AssetModule } from '../asset/asset.module';

@Module({
  imports: [PrismaModule, AssetModule],
  controllers: [RiskController],
  providers: [RiskService],
})
export class RiskModule {}
