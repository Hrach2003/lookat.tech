import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsString, MaxLength, MinLength } from 'class-validator';

type CreatePostType = Pick<Prisma.PostCreateInput, 'title' | 'content'>;

export class CreatePostDto implements CreatePostType {
  @IsString()
  @MaxLength(100)
  @MinLength(5)
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  content: string;
}
