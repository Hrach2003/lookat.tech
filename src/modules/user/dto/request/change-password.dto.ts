import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ required: true, minimum: 8 })
  @IsString()
  @MinLength(8)
  currentPassword: string;

  @ApiProperty({ required: true, minimum: 8 })
  @IsString()
  @MinLength(8)
  newPassword: string;
}
