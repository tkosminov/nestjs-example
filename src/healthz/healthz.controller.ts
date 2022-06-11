import { Controller, Get } from '@nestjs/common';

@Controller('healthz')
export class HealthzController {
  @Get()
  public async healthz() {
    return { message: 'ok' };
  }
}
