import { HttpModule, Module } from '@nestjs/common';

import { LoggerService } from '../../common/logger/logger.service';

import { Back2Controller } from './back2.controller';
import { Back2Service } from './back2.service';

@Module({
  imports: [HttpModule],
  providers: [
    Back2Service,
    {
      provide: LoggerService,
      useValue: new LoggerService('ApiBack2Controller'),
    },
  ],
  controllers: [Back2Controller],
  exports: [Back2Service],
})
export class Back2Module {}
