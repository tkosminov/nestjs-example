import { RabbitSubscribe } from '@nestjs-plus/rabbitmq';
import { Injectable } from '@nestjs/common';

import { LoggerService } from '../common/logger/logger.service';

import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';

import { CreateUserDTO } from '../user/dto/create.dto';

@Injectable()
export class RabbitService {
  constructor(private readonly userService: UserService, private readonly logger: LoggerService) {}

  // tslint:disable-next-line: no-feature-envy
  @RabbitSubscribe({
    exchange: 'core',
    routingKey: 'user_created',
    queue: 'auth_create_user',
  })
  public async createUser(msg: CreateUserDTO) {
    try {
      const user = Object.assign(new User(), {
        id: msg.id,
        email: msg.email,
        password: msg.password,
      });

      await this.userService.save(user);
    } catch (e) {
      // tslint:disable: no-unsafe-any
      this.logger.error(`UserCreate: Msg - ${JSON.stringify(msg)}`);
      this.logger.error(`UserCreate: ErrorMessage - ${JSON.stringify(e.message)}`);
      // tslint:enable: no-unsafe-any
    }

    return;
  }
}
