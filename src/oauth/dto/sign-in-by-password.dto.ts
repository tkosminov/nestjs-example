import { IsString, Length } from 'class-validator';

export class SignInByPasswordDTO {
  @IsString()
  @Length(4, 32)
  public readonly username: string;

  @Length(4, 32)
  public readonly password: string;
}
