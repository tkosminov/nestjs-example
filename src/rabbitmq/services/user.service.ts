import { Nack, RabbitSubscribe } from '@nestjs-plus/rabbitmq';
import { Injectable } from '@nestjs/common';

import { LoggerService } from '../../common/logger/logger.service';

import { UserService } from '../../core/user/user.service';

import { CreateUserDTO } from '../../core/user/dto/create.dto';

@Injectable()
export class UserAMQPService {
  constructor(private readonly userService: UserService, private readonly logger: LoggerService) {}

  // tslint:disable-next-line: no-feature-envy
  @RabbitSubscribe({
    exchange: 'api_1',
    routingKey: 'user_created',
    queue: 'nestjs_example_create_user',
  })
  public async userCreate(msg: CreateUserDTO) {
    try {
      return await this.userService.create(msg); // ack!
    } catch (err) {
      // tslint:disable: no-unsafe-any
      this.logger.error(`UserCreate: Msg - ${JSON.stringify(msg)}`);
      this.logger.error(`UserCreate: ErrorMessage - ${JSON.stringify(err.message)}`);
      // tslint:enable: no-unsafe-any
      return new Nack(true); // requeue
    }
  }
}
