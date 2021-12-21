import { Module } from '@nestjs/common';
import { PrismaService } from 'database/database.service';
import { CommentController } from 'modules/comment/comment.controller';
import { CommentRepository } from 'modules/comment/repository/comment.repository';
import { CommentGateway } from './comment.gateway';
import { CommentService } from './comment.service';

@Module({
  controllers: [CommentController],
  providers: [CommentGateway, CommentService, PrismaService, CommentRepository],
})
export class CommentModule {}
