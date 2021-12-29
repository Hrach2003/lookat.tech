import { TrueFields } from './../../../common/view/view.factory';
import { Injectable } from '@nestjs/common';
import { Prisma, Reply, User } from '@prisma/client';
import { PrismaService } from '../../../database/database.service';
import { CreateReplyDto } from '../dto/create-reply.dto';
import { CreateCommentDto } from '../dto/request/create-comment.dto';
import { commentDefaultView } from '../dto/response/comment.views';
import { UpdateCommentDto } from './../dto/request/update-comment.dto';

@Injectable()
export class CommentRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createPostComment<T extends TrueFields<Prisma.CommentSelect>>(
    user: User,
    createCommentDto: CreateCommentDto,
    commentSelect?: T,
  ) {
    return await this.prismaService.post
      .update({
        where: { id: createCommentDto.postId },
        data: {
          comments: {
            create: {
              message: createCommentDto.message,
              commenter: {
                connect: {
                  id: user.id,
                },
              },
            },
          },
        },
      })
      .comments({ select: commentSelect || commentDefaultView() });
  }

  async createCommentReply(
    user: User,
    createReply: CreateReplyDto,
  ): Promise<Reply[]> {
    return await this.prismaService.comment
      .update({
        where: { id: createReply.commentId },
        data: {
          replies: {
            create: {
              message: createReply.message,
              commenter: {
                connect: {
                  id: user.id,
                },
              },
            },
          },
        },
      })
      .replies();
  }

  async findUnique<T extends TrueFields<Prisma.CommentSelect>>(
    uniqueInput: Prisma.CommentWhereUniqueInput,
    commentSelect?: T,
  ) {
    return await this.prismaService.comment.findFirst({
      where: uniqueInput,
      select: commentSelect || commentDefaultView(),
    });
  }

  async edit<T extends TrueFields<Prisma.CommentSelect>>(
    commentId: number,
    updateCommentDto: UpdateCommentDto,
    commentSelect?: T,
  ) {
    return await this.prismaService.comment.update({
      where: { id: commentId },
      data: updateCommentDto,
      select: commentSelect || commentDefaultView(),
    });
  }
}
