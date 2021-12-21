import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User, Comment } from '@prisma/client';
import { CurrentUser } from 'decorators/current-user.decorator';
import { JwtAuthGuard } from 'modules/auth/guards/jwt.guard';
import { CreateCommentDto } from 'modules/comment/dto/request/create-comment.dto';
import { CreateReplyDto } from 'modules/comment/dto/create-reply.dto';
import { CommentService } from './comment.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { CommentDefaultView } from 'modules/comment/dto/response/comment-default.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('reply')
  @UseGuards(JwtAuthGuard)
  async reply(
    @Body() createReplyDto: CreateReplyDto,
    @CurrentUser() user: User,
  ) {
    return await this.commentService.replyToComment(user, createReplyDto);
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: [CommentDefaultView] })
  async comment(
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: User,
  ): Promise<Comment[]> {
    return await this.commentService.commentToPost(user, createCommentDto);
  }

  @Get(':id')
  @ApiOkResponse({ type: CommentDefaultView })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Comment> {
    return await this.commentService.findById(id);
  }
}
