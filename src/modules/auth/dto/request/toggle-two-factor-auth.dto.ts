import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class ToggleTwoFactorAuthDto {
  @ApiProperty()
  @IsBoolean()
  enable: boolean;
}
