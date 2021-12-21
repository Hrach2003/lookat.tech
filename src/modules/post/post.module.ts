import { Module } from '@nestjs/common';
import { PrismaService } from 'database/database.service';
import { PostRepository } from 'modules/post/repositories/post.repository';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  controllers: [PostController],
  providers: [PostService, PostRepository, PrismaService],
  exports: [PostService],
})
export class PostModule {}
