/* eslint-disable @typescript-eslint/naming-convention */

import { applyDecorators, SetMetadata } from '@nestjs/common';

import { RMQ_ROUTES_OPTIONS, IRouteOptions } from './rmq.constants';

export const RMQSubscribtion = (options: IRouteOptions): MethodDecorator => {
  return applyDecorators(
    SetMetadata(RMQ_ROUTES_OPTIONS, {
      ...options,
    }),
  );
};
