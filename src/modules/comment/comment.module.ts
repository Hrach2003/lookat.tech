import { Module } from '@nestjs/common';
import { PrismaService } from '../../database/database.service';
import { CommentController } from './comment.controller';
import { CommentGateway } from './comment.gateway';
import { CommentService } from './comment.service';
import { CommentRepository } from './repository/comment.repository';

@Module({
  controllers: [CommentController],
  providers: [CommentGateway, CommentService, PrismaService, CommentRepository],
})
export class CommentModule {}
