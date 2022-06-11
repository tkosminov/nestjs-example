/* eslint-disable @typescript-eslint/naming-convention */

import { applyDecorators, SetMetadata } from '@nestjs/common';

import { RMQ_ROUTES_OPTIONS, IRouteOptions, RMQ_PROVIDER_OPTIONS } from './rmq.constants';

export const RMQSubscription = (options: IRouteOptions): MethodDecorator => {
  return applyDecorators(
    SetMetadata(RMQ_ROUTES_OPTIONS, {
      ...options,
    })
  );
};

export const RMQProvider = (): ClassDecorator => {
  return applyDecorators(SetMetadata(RMQ_PROVIDER_OPTIONS, {}));
};
