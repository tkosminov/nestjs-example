import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import config from 'config';

import { DatabaseModule } from '../database/database.module';

import { OAuthController } from './oauth.controller';
import { OAuthService } from './oauth.service';
import { OAuthStrategy } from './oauth.strategy';

import { RefreshTokenModule } from './refresh_token/refresh_token.module';
import { UserModule } from './user/user.module';

const jwtSettings = config.get<IJwtSettings>('JWT_SETTINGS');

@Module({
  imports: [
    RefreshTokenModule,
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
  providers: [OAuthService, OAuthStrategy],
  controllers: [OAuthController],
  exports: [RefreshTokenModule, UserModule],
})
export class OAuthModule {}
