import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('healthz')
@Controller('healthz')
export class HealthcheckController {
  @Get()
  public async healthz() {
    return { message: 'OK' };
  }
}
