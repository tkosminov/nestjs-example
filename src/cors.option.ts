import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

import config from 'config';

import { throwBADREQUEST } from './common/errors';

const corsSettings = config.get<ICorsSettings>('CORS_SETTINGS');

export default {
  origin: (origin, callback) => {
    if (!origin || !corsSettings.allowedOrigins.length || corsSettings.allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(throwBADREQUEST('CORS_NOT_ALLOWED'));
    }
  },
  methods: corsSettings.allowedMethods,
  credentials: corsSettings.allowedCredentials,
} as CorsOptions;
