import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CommentService } from './comment.service';
import { CreateReplyDto } from './dto/create-reply.dto';
import { CreateCommentDto } from './dto/request/create-comment.dto';

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
  // @ApiOkResponse({ type: [CommentDefaultView] })
  async comment(
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: User,
  ) {
    return await this.commentService.commentToPost(user, createCommentDto);
  }

  @Get(':id')
  // @ApiOkResponse({ type: CommentDefaultView })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.commentService.findById(id);
  }
}
