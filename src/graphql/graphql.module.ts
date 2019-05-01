import { GraphQLModule } from '@nestjs/graphql';

import { SchemasModule } from './schemas/schemas.module';
import { SchemasService } from './schemas/schemas.service';

import { GraphqlOptions } from './graphql.options';

export default GraphQLModule.forRootAsync({
  imports: [SchemasModule],
  useClass: GraphqlOptions,
  inject: [SchemasService],
});
