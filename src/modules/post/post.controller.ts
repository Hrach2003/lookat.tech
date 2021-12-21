import { PaginationFactory } from './../../common/pagination.factory';
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
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { User, Post as PostEntity } from '@prisma/client';
import { PostPaginationRequest } from 'modules/post/dto/response/pagination-post.dto';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreatePostDto } from './dto/request/create-post.dto';
import { UpdatePostDto } from './dto/request/update-post.dto';
import { PostService } from './post.service';
import { PostDefaultView } from 'modules/post/dto/response/post-default.dto';

@Controller('post')
@ApiTags('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: PostDefaultView })
  async create(
    @CurrentUser() user: User,
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostEntity> {
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
  @ApiOkResponse({ type: [PostDefaultView] })
  async findAll(): Promise<PostEntity[]> {
    return await this.postService.findAll();
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: [PostDefaultView] })
  async findCurrentUserPosts(@CurrentUser() user: User): Promise<PostEntity[]> {
    return await this.postService.findByUser(user);
  }

  @Get(':id')
  @ApiOkResponse({ type: PostDefaultView })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<PostEntity> {
    return await this.postService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: [PostDefaultView] })
  async update(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostEntity[]> {
    return await this.postService.update(user, id, updatePostDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: PostDefaultView })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<PostEntity> {
    return await this.postService.remove(id);
  }
}
