import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { UserDefaultView } from 'modules/user/dto/response/user-default.dto';

export class CommentDefaultView implements Required<Prisma.CommentSelect> {
  @ApiProperty({ type: Number })
  id = true;

  @ApiProperty({ type: Date })
  createdAt = true;

  @ApiProperty({ type: Date })
  updatedAt = true;

  @ApiProperty({ type: String })
  message = true;

  @ApiProperty({ type: UserDefaultView })
  commenter = { select: new UserDefaultView({ comments: false }) };

  replies = false;
  post = false;
  commenterId = false;
  postId = false;
  _count = false;

  constructor(select?: Prisma.CommentSelect) {
    Object.assign(this, select);
  }
}
