import { repl } from '@nestjs/core';

import { ReplModule } from './repl.module';

async function bootstrap() {
  await repl(ReplModule);
}

bootstrap();
