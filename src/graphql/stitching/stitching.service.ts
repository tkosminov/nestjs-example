import { Injectable } from '@nestjs/common';
import { AsyncExecutor } from '@graphql-tools/utils';
import { introspectSchema, wrapSchema } from '@graphql-tools/wrap';

import config from 'config';
import { fetch } from 'cross-fetch';
import { GraphQLSchema, print } from 'graphql';
import { AbortController } from 'node-abort-controller';

import { LoggerService } from '../../logger/logger.service';
import { getForwardedIp, getIp } from '../../helpers/req.helper';

const api_urls = config.get<IGraphqlApis>('GRAPHQL_APIS');
const FETCH_TIMEOUT = 15000;

@Injectable()
export class GraphQLStitchingService {
  constructor(private readonly logger: LoggerService) {}

  public async schemas(): Promise<Array<GraphQLSchema | null>> {
    return Promise.all(Object.values(api_urls).map((url) => this.getApiSchema(url)));
  }

  private createExecutor(api_link: string, with_timeout = false): AsyncExecutor {
    return async ({ document, variables, context }) => {
      const query = print(document);

      let remote_address = '-';
      let forwarded_address = '-';
      let request_id: string = null;

      if (context?.req) {
        remote_address = getIp(context.req);
        forwarded_address = getForwardedIp(context.req);
        request_id = context.req.logger_store?.request_id;
      }

      const abort_controller = new AbortController();

      let time_out: NodeJS.Timeout = null;

      if (with_timeout) {
        time_out = setTimeout(function () {
          abort_controller.abort();
        }, FETCH_TIMEOUT);
      }

      const fetch_result = await fetch(api_link, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          remoteAddress: remote_address,
          forwardedAddress: forwarded_address,
          request_id: request_id,
        },
        body: JSON.stringify({ query, variables }),
        signal: abort_controller.signal as AbortSignal,
        keepalive: true,
      });

      if (time_out) {
        clearTimeout(time_out);
      }

      return fetch_result.json();
    };
  }

  private async getApiSchema(api_link: string): Promise<GraphQLSchema | null> {
    this.logger.info(`StitchingService: getApiSchema`, { api_link, query: 'introspectSchema' });

    try {
      const schema = wrapSchema({
        schema: await introspectSchema(this.createExecutor(api_link, true)),
        executor: this.createExecutor(api_link, false),
      });

      return schema;
    } catch (error) {
      this.logger.error(error.message, '', { api_link, query: 'introspectSchema' });

      return null;
    }
  }
}
