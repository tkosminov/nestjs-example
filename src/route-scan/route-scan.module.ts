import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { MetadataScanner } from '@nestjs/core/metadata-scanner';

import { RouteScanService } from './route-scan.service';

@Module({
  imports: [DiscoveryModule, MetadataScanner],
  providers: [RouteScanService],
  exports: [],
})
export class RouteScanModule {}
