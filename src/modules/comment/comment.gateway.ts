import { UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { User } from '@prisma/client';
import { CurrentUser } from 'decorators/current-user.decorator';
import { JwtAuthGuard } from 'modules/auth/guards/jwt.guard';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/request/create-comment.dto';
import { UpdateCommentDto } from './dto/request/update-comment.dto';

@WebSocketGateway()
export class CommentGateway {
  constructor(private readonly commentService: CommentService) {}

  @SubscribeMessage('createComment')
  @UseGuards(JwtAuthGuard)
  async comment(
    @CurrentUser() user: User,
    @MessageBody() createCommentDto: CreateCommentDto,
  ) {
    return await this.commentService.commentToPost(user, createCommentDto);
  }

  @SubscribeMessage('findOneComment')
  async findOne(@MessageBody() id: number) {
    return await this.commentService.findById(id);
  }

  @SubscribeMessage('updateComment')
  @UseGuards(JwtAuthGuard)
  async edit(@MessageBody() updateCommentDto: UpdateCommentDto) {
    return await this.commentService.edit(
      updateCommentDto.id,
      updateCommentDto,
    );
  }

  @SubscribeMessage('removeComment')
  remove(@MessageBody() id: number) {
    return this.commentService.remove(id);
  }
}
