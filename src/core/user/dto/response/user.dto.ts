import { ApiProperty } from '@nestjs/swagger';
import { User, UserRoleEnum } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserResponseDto implements User {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @Exclude()
  deletedAt: Date;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  avatar: string;

  @Exclude()
  password: string;

  @ApiProperty({ enum: UserRoleEnum })
  role: UserRoleEnum;

  constructor(user: User) {
    Object.assign(this, user);
  }
}
