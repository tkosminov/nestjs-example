import { Nack, RabbitSubscribe } from '@nestjs-plus/rabbitmq';
import { Injectable } from '@nestjs/common';

import { LoggerService } from '../../common/logger/logger.service';

import { passwordToHash } from '../../common/helpers/pswd.helper';

import { UserService } from '../../core/user/user.service';

import { CreateUserDTO } from '../../core/user/dto/create.dto';

@Injectable()
export class UserAMQPService {
  constructor(private readonly userService: UserService, private readonly logger: LoggerService) {}

  // tslint:disable-next-line: no-feature-envy
  @RabbitSubscribe({
    exchange: 'example',
    routingKey: 'user_created',
    queue: 'nestjs_example_create_user',
  })
  public async userCreate(msg: CreateUserDTO) {
    try {
      const data = { ...msg };
      data.password = passwordToHash(msg.password);

      return await this.userService.create(data); // ack!
    } catch (error) {
      // tslint:disable-next-line: no-unsafe-any
      this.logger.error(`UserCreate: ErrorMessage - ${JSON.stringify(error.message)}`);
      return new Nack(true); // requeue
    }
  }
}
