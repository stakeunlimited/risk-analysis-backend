import { Controller, Get } from '@nestjs/common';
import { RiskService } from './risk.service';

@Controller('risk')
export class RiskController {
  constructor(private readonly riskService: RiskService) {}

  @Get('assets')
  async getAssetsRisk() {
    return this.riskService.getAssetsRisk();
  }

  @Get('pools')
  async getPoolsRisk() {
    return this.riskService.getPoolsRisk();
  }
}
