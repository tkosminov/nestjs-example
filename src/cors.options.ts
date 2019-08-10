import { HttpException, HttpStatus } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

import config from 'config';

const corsSettings = config.get<ICorsSettings>('CORS_SETTINGS');

export default {
  origin: (origin, callback) => {
    if (!origin || !corsSettings.allowedOrigins.length || corsSettings.allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(
        new HttpException(
          {
            status: HttpStatus.UNAUTHORIZED,
            error: 'Not allowed by CORS',
          },
          HttpStatus.UNAUTHORIZED
        )
      );
    }
  },
  // methods: corsSettings.allowedMethods,
  // allowedHeaders: corsSettings.allowedHeaders,
  credentials: corsSettings.allowedCredentials,
} as CorsOptions;
