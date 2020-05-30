import { APP_INTERCEPTOR } from '@nestjs/core';

import { LoaderInterceptor } from './loader.interceptor';

export const LoaderProvider = {
  provide: APP_INTERCEPTOR,
  useClass: LoaderInterceptor,
};
