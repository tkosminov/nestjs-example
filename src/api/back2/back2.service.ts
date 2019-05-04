import { HttpService, Injectable } from '@nestjs/common';

import config from 'config';

const apiUrls = config.get<IApiUrls>('API_URLS');

@Injectable()
export class Back2Service {
  constructor(private readonly httpService: HttpService) {}

  public async index() {
    return await this.httpService.get(apiUrls.API_2_SERVICE);
  }
}
