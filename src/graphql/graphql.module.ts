import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';

import { LoggerModule } from '../logger/logger.module';
import { LoggerService } from '../logger/logger.service';

import { GraphqlOptions } from './graphql.options';
import { GraphQLStitchingService } from './stitching/stitching.service';
import { GraphQLStitchingModule } from './stitching/stitching.module';
import { GraphQLSchemaReloadModule } from './schema-reload/schema-reload.module';

export default GraphQLModule.forRootAsync({
  imports: [LoggerModule, GraphQLStitchingModule, GraphQLSchemaReloadModule],
  useClass: GraphqlOptions,
  inject: [LoggerService, GraphQLStitchingService],
  driver: ApolloDriver,
});
