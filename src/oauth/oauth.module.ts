import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { LoggerService } from '../common/logger/logger.service';

import config from 'config';

import { DatabaseModule } from '../database/database.module';

import { OAuthController } from './oauth.controller';
import { OAuthService } from './oauth.service';
import { OAuthStrategy } from './oauth.strategy';

import { UserModule } from '../core/user/user.module';
import { AuthModule } from './auth/auth.module';
import { ClientModule } from './client/client.module';

const jwtSettings = config.get<IJwtSettings>('JWT_SETTINGS');

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => ClientModule),
    forwardRef(() => AuthModule),
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
    OAuthService,
    OAuthStrategy,
    {
      provide: LoggerService,
      useValue: new LoggerService('OAuthController'),
    },
  ],
  controllers: [OAuthController],
})
export class OAuthModule {}
