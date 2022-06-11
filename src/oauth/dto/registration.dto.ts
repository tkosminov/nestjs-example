import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class RegistrationDTO {
  @ApiProperty({
    required: true,
    description: 'Логин',
  })
  @IsString()
  @Length(4, 32)
  public readonly login: string;

  @ApiProperty({
    required: true,
    description: 'Пароль',
  })
  @Length(4, 32)
  public readonly password: string;
}
