import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

import config from 'config';
import { Request } from 'express';

import { cors_not_allowed } from './common/errors';
import { getOrigin, getPath } from './common/helpers/req.helper';

const corsSettings = config.get<ICorsSettings>('CORS_SETTINGS');

export const corsOptionsDelegate: unknown = (req: Request, callback: (err: Error, options: CorsOptions) => void) => {
  const corsOptions: CorsOptions = {
    methods: corsSettings.allowedMethods,
    credentials: corsSettings.allowedCredentials,
    origin: false,
  };
  let error: Error | null = null;

  const origin = getOrigin(req);
  const path = getPath(req);

  if (!origin || !corsSettings.allowedOrigins.length || corsSettings.allowedOrigins.indexOf(origin) !== -1) {
    corsOptions.origin = true;
    error = null;
  } else if (corsSettings.allowedPaths.length && corsSettings.allowedPaths.indexOf(path) !== -1) {
    corsOptions.origin = true;
    error = null;
  } else {
    corsOptions.origin = false;
    error = cors_not_allowed({ raise: false });
  }

  callback(error, corsOptions);
};
