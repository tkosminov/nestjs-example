import { Injectable } from '@nestjs/common';

@Injectable()
export class CoreService {
  public index() {
    return {
      message: 'OK',
    };
  }
}
