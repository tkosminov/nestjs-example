import { ApiProperty } from '@nestjs/swagger';

export class SignInResponseDTO {
  @ApiProperty({
    required: true,
    description: 'JWT access token',
  })
  public readonly access_token: string;

  @ApiProperty({
    required: true,
    description: 'JWT refresh token',
  })
  public readonly refresh_token: string;
}
