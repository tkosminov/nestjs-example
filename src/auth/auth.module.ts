import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { LoggerService } from '../common/logger/logger.service';

import config from 'config';

import { DatabaseModule } from '../database/database.module';
import { UserModule } from '../user/user.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthStrategy } from './auth.strategy';

const jwtSettings = config.get<IJwtSettings>('JWT_SETTINGS');

@Module({
  imports: [
    UserModule,
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secretOrPrivateKey: jwtSettings.secretKey,
      signOptions: {
        expiresIn: jwtSettings.expiresIn,
      },
    }),
  ],
  providers: [
    AuthService,
    AuthStrategy,
    {
      provide: LoggerService,
      useValue: new LoggerService('AuthController'),
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
