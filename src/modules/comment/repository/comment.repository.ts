import { CommentDefaultView } from './../dto/response/comment-default.dto';
import { Injectable } from '@nestjs/common';
import { Comment, Prisma, Reply, User } from '@prisma/client';
import { PrismaService } from '../../../database/database.service';
import { CreateReplyDto } from '../dto/create-reply.dto';
import { CreateCommentDto } from '../dto/request/create-comment.dto';
import { UpdateCommentDto } from './../dto/request/update-comment.dto';

@Injectable()
export class CommentRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createPostComment(
    user: User,
    createCommentDto: CreateCommentDto,
    commentSelect = new CommentDefaultView(),
  ): Promise<Comment[]> {
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
      .comments({ select: commentSelect });
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

  async findUnique(
    uniqueInput: Prisma.CommentWhereUniqueInput,
    commentSelect = new CommentDefaultView(),
  ) {
    return await this.prismaService.comment.findFirst({
      where: uniqueInput,
      select: commentSelect,
    });
  }

  async edit(
    commentId: number,
    updateCommentDto: UpdateCommentDto,
    commentSelect = new CommentDefaultView(),
  ) {
    return await this.prismaService.comment.update({
      where: { id: commentId },
      data: updateCommentDto,
      select: commentSelect,
    });
  }
}
