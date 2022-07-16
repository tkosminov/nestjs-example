import { IsJWT } from 'class-validator';

export class SignInByRefreshTokenDTO {
  @IsJWT()
  public readonly refresh_token: string;
}
