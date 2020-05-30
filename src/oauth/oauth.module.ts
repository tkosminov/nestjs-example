import { Module } from '@nestjs/common';

import { OAuthController } from './oauth.controller';
import { OAuthService } from './oauth.service';

import { RefreshTokenModule } from './refresh_token/refresh_token.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [RefreshTokenModule, UserModule],
  providers: [OAuthService],
  controllers: [OAuthController],
  exports: [RefreshTokenModule, UserModule, OAuthService],
})
export class OAuthModule {}
