import { GqlModuleOptions, GraphQLModule } from '@nestjs/graphql';
import { Request } from 'express';

import { join } from 'path';

import { GraphQLSchema } from 'graphql';
import { mergeSchemas } from 'graphql-tools';

import { CoreModule } from './core/core.module';
import { CoreService } from './core/core.service';

export default GraphQLModule.forRootAsync({
  imports: [CoreModule],
  useFactory: (coreService: CoreService) => {
    return {
      typePaths: ['./src/**/*.graphql'],
      debug: true,
      playground: true,
      installSubscriptionHandlers: true,
      context: ({ req }: { req: Request }) => ({ req }),
      definitions: {
        path: join(process.cwd(), 'src/graphql.schema.ts'),
        outputAs: 'interface',
      },

      transformSchema: async (schema: GraphQLSchema) => {
        const schemas: GraphQLSchema[] = [schema];

        schemas.push(await coreService.getSchema());

        return mergeSchemas({
          schemas: schemas.filter(s => s),
        });
      },
    } as GqlModuleOptions;
  },
  inject: [CoreService],
});
