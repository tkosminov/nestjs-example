import { SubschemaConfig } from '@graphql-tools/delegate';
import { stitchSchemas } from '@graphql-tools/stitch';
import { stitchingDirectives } from '@graphql-tools/stitching-directives';
import { AsyncExecutor } from '@graphql-tools/utils';
import { schemaFromExecutor } from '@graphql-tools/wrap';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { fetch } from '@whatwg-node/fetch';
import { Request } from 'express';
import { GraphQLSchema, print } from 'graphql';
import { AbortController } from 'node-abort-controller';
import { BehaviorSubject } from 'rxjs';

import { LoggerService } from '../../logger/logger.service';
import { LoggerStore } from '../../logger/logger.store';
import { IJwtPayload } from '../../oauth/user/user.entity';
import { getForwardedIp, getIp } from '../../utils/request';

const ABORT_TIME_OUT: number = process.env.ABORT_TIME_OUT ? +process.env.ABORT_TIME_OUT : 20000;
const { stitchingDirectivesTransformer } = stitchingDirectives();

@Injectable()
export class GraphQLStitchingService {
  private current_schema: GraphQLSchema | null = null;
  private sub_schemas: (SubschemaConfig | GraphQLSchema)[] = [];

  public readonly schema$ = new BehaviorSubject<GraphQLSchema | null>(null);
  private readonly api_urls: string[] = [];

  constructor(
    private readonly config: ConfigService,
    private readonly logger: LoggerService
  ) {
    this.api_urls.push(...JSON.parse(this.config.getOrThrow<string>('GRAPHQL_API_URLS')));
  }

  public async reloadSchemas() {
    this.logger.info(`GraphQLStitchingService: reloadSchemas`, { third_party_schemes: this.api_urls.length });

    this.sub_schemas = this.current_schema ? [this.current_schema] : [];

    if (this.api_urls.length) {
      await Promise.all(this.api_urls.map((api_uri) => this.loadSchema(api_uri)));
    }

    this.schema$.next(
      stitchSchemas({
        subschemaConfigTransforms: [stitchingDirectivesTransformer],
        subschemas: this.sub_schemas,
      })
    );
  }

  public setCurrentSchema(schema: GraphQLSchema) {
    this.current_schema = schema;
  }

  private createExecutor(uri: string, abort: boolean): AsyncExecutor {
    return async ({ document, variables, operationName, extensions, context }) => {
      const query = print(document);

      const abort_controller: AbortController = new AbortController();
      let time_out: NodeJS.Timeout | null = null;

      if (abort) {
        time_out = setTimeout(() => {
          abort_controller.abort();
        }, ABORT_TIME_OUT);
      }

      let current_user = '{}';
      let ip = '-';
      let forwarded_ip = '-';
      let request_id = '';

      const req: (Request & { logger_store: LoggerStore; current_user: IJwtPayload }) | undefined = context?.req;

      if (req) {
        ip = getIp(req);
        forwarded_ip = getForwardedIp(req);
        current_user = JSON.stringify(req.current_user || {});
        request_id = req.logger_store.request_id;
      }

      const fetch_result = await fetch(uri, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Accept: 'application/json',
          current_user,
          ip,
          'X-Forwarded-For': forwarded_ip,
          request_id,
        },
        body: JSON.stringify({ query, variables, operationName, extensions }),
        signal: abort_controller.signal as AbortSignal,
        keepalive: true,
      });

      if (time_out) {
        clearTimeout(time_out);
        time_out = null;
      }

      return fetch_result.json();
    };
  }

  private async loadSchema(uri: string) {
    try {
      const sub_schema: SubschemaConfig = {
        schema: await schemaFromExecutor(this.createExecutor(uri, true)),
        executor: this.createExecutor(uri, false),
        batch: true,
      };

      this.sub_schemas.push(sub_schema);

      this.logger.info(`GraphQLStitchingService: loadSchema`, { query: 'introspectSchema', uri });
    } catch (error) {
      this.logger.error(error, { query: 'introspectSchema', uri });
    }
  }
}
