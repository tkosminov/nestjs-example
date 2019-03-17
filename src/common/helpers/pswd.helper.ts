import { createHmac } from 'crypto';

import config from 'config';

export const passwordToHash = (password: string) => {
  return createHmac('sha256', config.get<IAppSettings>('APP_SETTINGS').secretKey)
    .update(password)
    .digest('hex');
};
