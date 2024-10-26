import { Body, Controller, Get, Query } from '@nestjs/common';
import { RiskService } from './risk.service';

@Controller('risk')
export class RiskController {
  constructor(private readonly riskService: RiskService) {}

  @Get('/')
  async getTotalPoolRisk(@Query() { poolAddress }: { poolAddress: string }) {
    return this.riskService.getTotalPoolRisk(poolAddress);
  }

  @Get('chains')
  async getChainsRisk() {
    return this.riskService.getChainsRisk();
  }

  @Get('protocols')
  async getProtocolsRisk() {
    return this.riskService.getProtocolsRisk();
  }

  @Get('pools')
  async getPoolsRisk() {
    return this.riskService.getPoolsRisk();
  }

  @Get('assets')
  async getAssetsRisk() {
    return this.riskService.getAssetsRisk();
  }
}
