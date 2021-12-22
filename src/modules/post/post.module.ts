import { Module } from '@nestjs/common';
import { PrismaService } from '../../database/database.service';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostRepository } from './repositories/post.repository';

@Module({
  controllers: [PostController],
  providers: [PostService, PostRepository, PrismaService],
  exports: [PostService],
})
export class PostModule {}
