import { GqlModuleOptions, GraphQLModule } from '@nestjs/graphql';
import { Request } from 'express';

import { join } from 'path';

import { GraphQLSchema } from 'graphql';
import { mergeSchemas } from 'graphql-tools';

import { SchemasModule } from './schemas/schemas.module';
import { SchemasService } from './schemas/schemas.service';

export default GraphQLModule.forRootAsync({
  imports: [SchemasModule],
  useFactory: (schemasService: SchemasService) => {
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
        const schemas: GraphQLSchema[] = [schema, ...(await schemasService.getSchemas())];

        return mergeSchemas({
          schemas: schemas.filter(s => s),
        });
      },
    } as GqlModuleOptions;
  },
  inject: [SchemasService],
});
