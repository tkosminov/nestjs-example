import { GraphQLModule } from '@nestjs/graphql';

import { LoggerModule } from '../logger/logger.module';
import { LoggerService } from '../logger/logger.service';

import { StitchingModule } from './stitching/stitching.module';
import { StitchingService } from './stitching/stitching.service';

import { GraphqlOptions } from './graphql.options';

export default GraphQLModule.forRootAsync({
  imports: [LoggerModule, StitchingModule],
  useClass: GraphqlOptions,
  inject: [LoggerService, StitchingService],
});
