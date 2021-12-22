import { Injectable } from '@nestjs/common';
import { Reply, User } from '@prisma/client';
import { CreateReplyDto } from './dto/create-reply.dto';
import { CreateCommentDto } from './dto/request/create-comment.dto';
import { UpdateCommentDto } from './dto/request/update-comment.dto';
import { CommentRepository } from './repository/comment.repository';

@Injectable()
export class CommentService {
  constructor(private readonly commentRepository: CommentRepository) {}

  async replyToComment(
    user: User,
    createReplyDto: CreateReplyDto,
  ): Promise<Reply[]> {
    return await this.commentRepository.createCommentReply(
      user,
      createReplyDto,
    );
  }

  async commentToPost(user: User, createCommentDto: CreateCommentDto) {
    return await this.commentRepository.createPostComment(
      user,
      createCommentDto,
    );
  }

  async findById(id: number) {
    return await this.commentRepository.findUnique({ id });
  }

  async edit(id: number, updateCommentDto: UpdateCommentDto) {
    return await this.commentRepository.edit(id, updateCommentDto);
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
