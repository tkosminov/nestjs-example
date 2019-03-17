import { IsEmail, MinLength } from 'class-validator';

import { User } from '../user.entity';

export class CreateUserDTO implements Omit<User, 'id' | 'createdAt' | 'updatedAt'> {
  @IsEmail()
  public readonly email: string;

  @MinLength(7)
  public readonly password: string;
}
