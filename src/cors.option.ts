import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

import config from 'config';
import { Request } from 'express';

import { cors_not_allowed } from './common/errors';
import { getOrigin, getPath } from './common/helpers/req.helper';

const cors_settings = config.get<ICorsSettings>('CORS_SETTINGS');

export const corsOptionsDelegate: unknown = (
  req: Request,
  callback: (err: Error, options: CorsOptions) => void,
) => {
  const cors_options: CorsOptions = {
    methods: cors_settings.allowedMethods,
    credentials: cors_settings.allowedCredentials,
    origin: false,
  };
  let error: Error | null = null;

  const origin = getOrigin(req);
  const url = getPath(req);

  if (
    !origin ||
    !cors_settings.allowedOrigins.length ||
    cors_settings.allowedOrigins.indexOf(origin) !== -1
  ) {
    cors_options.origin = true;
    error = null;
  } else if (
    cors_settings.allowedUrls.length &&
    cors_settings.allowedUrls.indexOf(url) !== -1
  ) {
    cors_options.origin = true;
    error = null;
  } else {
    cors_options.origin = false;
    error = cors_not_allowed({ raise: false });
  }

  callback(error, cors_options);
};
