import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { CommentDefaultView } from 'modules/comment/dto/response/comment-default.dto';
import { UserDefaultView } from 'modules/user/dto/response/user-default.dto';

export class PostDefaultView implements Required<Prisma.PostSelect> {
  @ApiProperty({ type: Number })
  id = true;

  @ApiProperty({ type: Date })
  createdAt = true;

  @ApiProperty({ type: Date })
  updatedAt = true;

  @ApiProperty({ type: String })
  title = true;

  @ApiProperty({ type: String })
  content = true;

  @ApiProperty({ type: CommentDefaultView })
  comments = { select: new CommentDefaultView() };

  @ApiProperty({ type: UserDefaultView })
  author = { select: new UserDefaultView({ posts: false }) };

  authorId = false;
  _count = false;

  constructor(select?: Prisma.PostSelect) {
    Object.assign(select);
  }
}
