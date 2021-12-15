import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsDefined()
  @ApiProperty()
  email: string;

  @IsString()
  @IsDefined()
  @MinLength(8)
  @ApiProperty()
  password: string;
}
