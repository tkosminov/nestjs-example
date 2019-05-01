import { HttpService, Injectable } from '@nestjs/common';

import config from 'config';

const apiUrls: IApiUrls = config.get('API_URLS');

@Injectable()
export class CoreService {
  constructor(private readonly httpService: HttpService) {}

  public async index() {
    return await this.httpService.get(apiUrls.API_2_SERVICE);
  }
}
