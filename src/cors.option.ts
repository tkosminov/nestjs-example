import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

import config from 'config';
import { Request } from 'express';

import { cors_not_allowed } from './common/errors';

const corsSettings = config.get<ICorsSettings>('CORS_SETTINGS');

export const corsOptionsDelegate: unknown = (req: Request, callback: (err: Error, options: CorsOptions) => void) => {
  let corsOptions: CorsOptions;
  let error: Error | null = null;

  const origin = req.header('origin');
  const url = (req.originalUrl || req.url || req.baseUrl).split('?')[0];

  if (!origin || !corsSettings.allowedOrigins.length || corsSettings.allowedOrigins.indexOf(origin) !== -1) {
    corsOptions = { origin: true };
    error = null;
  } else if (corsSettings.allowedUrls.length && corsSettings.allowedUrls.indexOf(url) !== -1) {
    corsOptions = { origin: true };
    error = null;
  } else {
    corsOptions = { origin: false };
    error = cors_not_allowed({ raise: false });
  }

  callback(error, corsOptions);
};
