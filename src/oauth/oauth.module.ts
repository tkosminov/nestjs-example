import { Module } from '@nestjs/common';

import { JwtModule } from '../jwt/jwt.module';
import { OAuthController } from './oauth.controller';
import { OAuthService } from './oauth.service';
import { RecoveryKeyModule } from './recovery-key/recovery-key.module';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, RefreshTokenModule, RecoveryKeyModule, JwtModule],
  providers: [OAuthService],
  controllers: [OAuthController],
  exports: [UserModule, RefreshTokenModule, RecoveryKeyModule],
})
export class OAuthModule {}
