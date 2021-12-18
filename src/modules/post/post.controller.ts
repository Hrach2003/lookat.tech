import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
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
  update(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(user, id, updatePostDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.postService.remove(id);
  }
}
