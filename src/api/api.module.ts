import { Module } from '@nestjs/common';

import { Back2Module } from './back2/back2.module';

@Module({
  imports: [Back2Module],
  providers: [],
  exports: [Back2Module],
})
export class ApiModule {}
