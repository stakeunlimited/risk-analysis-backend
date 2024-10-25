import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AssetModule } from './asset/asset.module';
import { ConfigModule } from '@nestjs/config';
import { RiskModule } from './risk/risk.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AssetModule, PrismaModule, RiskModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
