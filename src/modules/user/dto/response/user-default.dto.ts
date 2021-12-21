import { ApiProperty } from '@nestjs/swagger';
import { Prisma, UserRoleEnum } from '@prisma/client';
import { CommentDefaultView } from 'modules/comment/dto/response/comment-default.dto';
import { PostDefaultView } from 'modules/post/dto/response/post-default.dto';

export class UserDefaultView implements Required<Prisma.UserSelect> {
  @ApiProperty({ type: Number })
  id = true;

  @ApiProperty({ type: Date })
  createdAt = true;

  @ApiProperty({ type: Date })
  updatedAt = true;

  @ApiProperty({ type: String })
  name = true;

  @ApiProperty({ type: String })
  email = true;

  @ApiProperty({ type: String })
  avatar = true;

  @ApiProperty({ enum: UserRoleEnum })
  role = true;

  @ApiProperty({ type: [PostDefaultView] })
  posts = { select: new PostDefaultView({ author: false }) };

  @ApiProperty({ type: [CommentDefaultView] })
  comments = { select: new CommentDefaultView() };

  @ApiProperty({ type: [UserDefaultView] })
  friends = {
    select: new UserDefaultView({ friends: false }),
  };

  replies = false;
  friendsRelation = false;
  password = false;
  _count = false;
  deletedAt = false;

  constructor(select?: Prisma.UserSelect) {
    Object.assign(this, select);
  }
}
