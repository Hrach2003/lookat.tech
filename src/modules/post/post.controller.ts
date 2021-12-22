import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { PaginationFactory } from './../../common/pagination.factory';
import { CreatePostDto } from './dto/request/create-post.dto';
import { UpdatePostDto } from './dto/request/update-post.dto';
import { PostPaginationRequest } from './dto/response/pagination-post.dto';
import { PostService } from './post.service';

@Controller('post')
@ApiTags('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async create(
    @CurrentUser() user: User,
    @Body() createPostDto: CreatePostDto,
  ) {
    return await this.postService.create(user, createPostDto);
  }

  @Post('filter')
  async filter(@Query() paginationRequestDto: PostPaginationRequest) {
    const filteredPosts = await this.postService.filter(paginationRequestDto);

    return PaginationFactory.create(paginationRequestDto, {
      count: filteredPosts.count,
      data: filteredPosts.posts,
    });
  }

  @Get()
  async findAll() {
    return await this.postService.findAll();
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async findCurrentUserPosts(@CurrentUser() user: User) {
    return await this.postService.findByUser(user);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.postService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return await this.postService.update(user, id, updatePostDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.postService.remove(id);
  }
}
