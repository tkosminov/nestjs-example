import { GraphQLModule } from '@nestjs/graphql';

import { LoggerModule } from '../common/logger/logger.module';
import { LoggerService } from '../common/logger/logger.service';

import { StitchingModule } from './stitching/stitching.module';
import { StitchingService } from './stitching/stitching.service';

import { GraphqlOptions } from './graphql.options';

export default GraphQLModule.forRootAsync({
  imports: [StitchingModule, LoggerModule],
  useClass: GraphqlOptions,
  inject: [StitchingService, LoggerService],
});
