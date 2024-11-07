import { ApiProperty } from '@nestjs/swagger';

export class RegistrationResponseDTO {
  @ApiProperty({
    required: true,
    type: String,
    isArray: true,
    description: 'Recovery keys',
  })
  public readonly recovery_keys: string[];
}
