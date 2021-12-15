import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RolesEnum } from 'src/core/user/entities/role.enum';

export class CreateUserDto {
  @IsString()
  @ApiProperty({ required: true })
  name: string;

  @IsEmail()
  @ApiProperty({ required: true })
  email: string;

  @ApiProperty({ required: true, minimum: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ enum: RolesEnum })
  @IsEnum(RolesEnum)
  @IsOptional()
  role: RolesEnum;
}
