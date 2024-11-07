import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, Length } from 'class-validator';

export class ChangePasswordDTO {
  @ApiProperty({
    required: true,
    description: 'Recovery key',
  })
  @IsUUID()
  public readonly recovery_key: string;

  @ApiProperty({
    required: true,
    description: 'New password',
  })
  @Length(4, 32)
  public readonly new_password: string;
}
