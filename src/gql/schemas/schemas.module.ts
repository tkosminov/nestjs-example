import { Module } from '@nestjs/common';
import { SchemasService } from './schemas.service';

@Module({
  providers: [SchemasService],
  exports: [SchemasService],
})
export class SchemasModule {}
