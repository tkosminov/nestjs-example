import { getConnection } from 'typeorm';

import { passwordToHash } from '../../common/helpers/password.helper';
import { LoggerService } from '../../logger/logger.service';

import { CreateUserDTO } from '../../oauth/user/dto/create.dto';
import { User } from '../../oauth/user/user.entity';

const create = async (msg: CreateUserDTO, logger: LoggerService) => {
  try {
    return await getConnection().transaction(async (entityManager) => {
      if (!msg.password) {
        return 'nack';
      }

      const user = { ...msg };

      user.password = passwordToHash(user.password);

      Object.keys(user).forEach((key) => !user[key] && delete user[key]);

      await entityManager.getRepository(User).createQueryBuilder().insert().into(User).values([user]).execute();

      return 'ack';
    });
  } catch (error) {
    logger.error(error.message, error.stack, 'Consume - user_created');
    return 'nack';
  }
};

export default [
  {
    options: {
      exchange: 'user_service',
      routingKey: 'user_created',
      queue: 'example_create_user',
    },
    handler: create,
  },
];
