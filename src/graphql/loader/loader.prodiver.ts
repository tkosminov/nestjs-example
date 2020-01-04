import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoaderInterceptor } from './loader.interceptor';

// tslint:disable-next-line: variable-name
export const LoaderProvider = {
  provide: APP_INTERCEPTOR,
  useClass: LoaderInterceptor,
};
