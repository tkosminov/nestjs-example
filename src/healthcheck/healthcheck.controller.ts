import { Controller, Get } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';

@ApiUseTags('healthz')
@Controller('healthz')
export class HealthcheckController {
  @Get()
  public healthz() {
    return { message: 'OK' };
  }
}
