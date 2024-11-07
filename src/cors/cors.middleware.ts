import { CorsOptions, CorsOptionsDelegate } from '@nestjs/common/interfaces/external/cors-options.interface';
import { Request } from 'express';

import { getMethod, getOrigin, getPath } from '../utils/request';

export interface ICorsOptions {
  allowed_origins: string[];
  allowed_methods: string[];
  allowed_paths: string[];
  credentials: boolean;
}

export const CorsMiddleware =
  (options: ICorsOptions): CorsOptionsDelegate<Request> =>
  (req, callback) => {
    const cors_options: CorsOptions = {
      methods: options.allowed_methods,
      credentials: options.credentials,
      origin: false,
    };

    let error: Error | null = new Error('CORS_NOT_ALLOWED');

    const origin = getOrigin(req);
    const method = getMethod(req);
    const path = getPath(req);

    if (!origin || !options.allowed_origins.length || options.allowed_origins.includes(origin)) {
      cors_options.origin = true;
      error = null;
    } else if (options.allowed_methods.length && options.allowed_methods.includes(method)) {
      cors_options.origin = true;
      error = null;
    } else if (options.allowed_paths.length && options.allowed_paths.includes(path)) {
      cors_options.origin = true;
      error = null;
    }

    callback(error, cors_options);
  };
