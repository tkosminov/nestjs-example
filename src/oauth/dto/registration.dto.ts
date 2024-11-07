import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class RegistrationDTO {
  @ApiProperty({
    required: true,
    description: 'Username',
  })
  @IsString()
  @Length(4, 32)
  public readonly username: string;

  @ApiProperty({
    required: true,
    description: 'Password',
  })
  @Length(4, 32)
  public readonly password: string;
}
