import { forwardRef, Inject, Injectable } from '@nestjs/common';

import config from 'config';
import jwt from 'jsonwebtoken';

import { UserService } from '../user/user.service';

import { CreateUserDTO } from '../user/dto/create.dto';
import { LoginUserDTO } from '../user/dto/login.dto';

import { IJwtPayload } from './interfaces/jwt-payload.iterface';

const jwtSettings = config.get<IJwtSettings>('JWT_SETTINGS');

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
  ) {}

  public async createToken(credentials: LoginUserDTO) {
    const user = await this.userService.login(credentials);
    const accessToken = jwt.sign({ id: user.id, email: user.email }, jwtSettings.secretKey, {
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
