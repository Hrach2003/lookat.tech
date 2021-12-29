import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthCodeDto {
  @IsString()
  @ApiProperty()
  code: string;
}
