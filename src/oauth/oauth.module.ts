import { Module } from '@nestjs/common';

import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { UserModule } from './user/user.module';
import { OAuthController } from './oauth.controller';
import { OAuthService } from './oauth.service';
import { RecoveryKeyModule } from './recovery-key/recovery-key.module';

@Module({
  imports: [UserModule, RefreshTokenModule, RecoveryKeyModule],
  providers: [OAuthService],
  controllers: [OAuthController],
  exports: [UserModule, RefreshTokenModule, RecoveryKeyModule],
})
export class OAuthModule {}
