import { HttpModule, Module } from '@nestjs/common';

import { LoggerService } from '../../common/logger/logger.service';

import { CoreController } from './core.controller';
import { CoreService } from './core.service';

@Module({
  imports: [HttpModule],
  providers: [
    CoreService,
    {
      provide: LoggerService,
      useValue: new LoggerService('CoreController'),
    },
  ],
  controllers: [CoreController],
  exports: [CoreService],
})
export class CoreModule {}
