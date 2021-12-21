import { IsInt, IsString, MaxLength } from 'class-validator';

export class CreateReplyDto {
  @IsInt()
  commentId: number;

  @IsString()
  @MaxLength(200)
  message: string;
}
