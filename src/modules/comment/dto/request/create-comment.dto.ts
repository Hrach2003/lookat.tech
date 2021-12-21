import { IsInt, IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsInt()
  postId: number;

  @IsString()
  @MaxLength(200)
  message: string;
}
