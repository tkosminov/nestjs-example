import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';

import config from 'config';
import jwt from 'jsonwebtoken';

import { UserService } from '../user/user.service';

import { CreateUserDTO } from '../user/dto/create.dto';
import { LoginUserDTO } from '../user/dto/login.dto';

import { IJwtPayload } from './interfaces/jwt-payload.iterface';

import { passwordToHash } from 'src/common/helpers/pswd.helper';

const jwtSettings = config.get<IJwtSettings>('JWT_SETTINGS');

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
  ) {}

  public async createToken(credentials: LoginUserDTO) {
    const user = await this.userService.findOneBy(
      {
        email: credentials.email,
        password: passwordToHash(credentials.password),
      },
      ['permissions']
    );

    if (!user) {
      throw new UnauthorizedException('Invalie email or password');
    }

    const accessToken = jwt.sign(user.toJSON(), jwtSettings.secretKey, {
      expiresIn: jwtSettings.expiresIn,
    });

    // tslint:disable-next-line: no-feature-envy
    return {
      expiresIn: jwtSettings.expiresIn,
      accessToken,
    };
  }

  public async rigistration(credentials: CreateUserDTO) {
    const user = await this.userService.create(credentials);
    return { email: user.email, createdAt: user.createdAt };
  }

  public async verifyToken(token: string) {
    return (await jwt.verify(token, jwtSettings.secretKey)) as IJwtPayload;
  }

  public async validateUser(payload: IJwtPayload) {
    return await this.userService.findOne(payload.id);
  }
}
