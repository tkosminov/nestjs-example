import { ApiProperty } from '@nestjs/swagger';

export class SignInResponseDTO {
  @ApiProperty({
    required: true,
    description: 'JWT token',
  })
  public readonly token: string;

  @ApiProperty({
    required: true,
    description: 'Token type',
  })
  public readonly token_type: string;

  @ApiProperty({
    required: true,
    description: 'JWT Token expires at (DateTime)',
  })
  public readonly token_expires_at: string;

  @ApiProperty({
    required: true,
    description: 'Refresh token',
  })
  public readonly refresh_token: string;

  @ApiProperty({
    required: true,
    description: 'Refresh Token expires at (DateTime)',
  })
  public readonly refresh_token_expires_at: string;
}
