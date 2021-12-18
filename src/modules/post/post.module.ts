import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/database.service';
import { PostRepository } from 'src/modules/post/repositories/post.repository';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  controllers: [PostController],
  providers: [PostService, PostRepository, PrismaService],
  exports: [PostService],
})
export class PostModule {}
