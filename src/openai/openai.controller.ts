import { Controller, Get, Query } from '@nestjs/common';
import { OpenaiService } from './openai.service';

@Controller('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Get('/test')
  async test() {
    return this.openaiService.test();
  }

  @Get('/analyze-security-audit')
  async analyzeSecurityAudit(@Query() { url }: { url: string }) {
    return this.openaiService.analyzeSecurityAudit(url);
  }
}
