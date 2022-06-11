import { IsUUID } from 'class-validator';

export class SignInByRefreshTokenDTO {
  @IsUUID()
  public readonly refresh_token: string;
}
