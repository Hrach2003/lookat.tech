import { Test } from '@nestjs/testing';
import { Post, User } from '@prisma/client';
import { AppConfigModule } from '../../../config/config.module';
import { PrismaService } from '../../../database/database.service';
import { CreateCommentDto } from './../dto/request/create-comment.dto';
import { CommentRepository } from './comment.repository';

describe('CommentRepository', () => {
  let commentRepository: CommentRepository;
  let prismaService: PrismaService;
  let user: User;
  let post: Post;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppConfigModule],
      providers: [PrismaService, CommentRepository],
    }).compile();

    prismaService = moduleRef.get<PrismaService>(PrismaService);
    commentRepository = moduleRef.get<CommentRepository>(CommentRepository);

    user = await prismaService.user.create({
      data: {
        email: `${Math.random()}@gmail.com`,
        name: 'Random Guy',
        password: '12345678',
      },
    });

    post = await prismaService.post.create({
      data: {
        author: {
          connect: {
            id: user.id,
          },
        },
        title: 'Random post',
        content: 'Random post content',
      },
    });
  });

  afterAll(() => {
    return prismaService.$disconnect();
  });

  describe('comment on post', () => {
    it('should be defined', async () => {
      expect(commentRepository).toBeDefined();
      expect(prismaService).toBeDefined();
    });

    it('should have createPostComment method', async () => {
      expect(commentRepository.createPostComment).toBeDefined();
      expect(prismaService).toBeDefined();
    });

    it('should append comment to post', async () => {
      const createCommentDto: CreateCommentDto = {
        message: 'This post is awesome',
        postId: post.id,
      };
      const comments = await commentRepository.createPostComment(
        user,
        createCommentDto,
      );

      expect(comments.length).toBeGreaterThan(0);
      expect(comments.at(-1).message).toEqual(createCommentDto.message);
    });

    it('should throw error: Post with id does not exist', async () => {
      const createCommentDto: CreateCommentDto = {
        message: 'This post is awesome',
        postId: post.id + 1, // non existing id
      };

      async function createComment() {
        await commentRepository.createPostComment(user, createCommentDto);
      }

      expect(createComment).rejects;
    });
  });
});
