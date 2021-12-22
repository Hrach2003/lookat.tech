import { Test } from '@nestjs/testing';
import { Comment, Post, Reply, User } from '@prisma/client';
import { PrismaService } from '../../../database/database.service';
import { CreateCommentDto } from './../dto/request/create-comment.dto';
import { CreateReplyDto } from '../dto/create-reply.dto';
import { CommentRepository } from './comment.repository';
import { AppConfigModule } from 'config/config.module';

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
      expect(comments[comments.length - 1].message).toEqual(
        createCommentDto.message,
      );
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

  describe('reply to a comment', () => {
    let comment: Comment;
    let repliesBefore: Reply[];

    beforeAll(async () => {
      comment = await prismaService.comment.create({
        data: {
          message: 'Random text',
          post: {
            connect: {
              id: post.id,
            },
          },
          commenter: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      console.log(comment);

      repliesBefore = await prismaService.comment
        .findUnique({
          where: { id: comment.id },
        })
        .replies();
    });

    const createReplyDto: CreateReplyDto = {
      message: `Replying to comment with id ${comment.id}`,
      commentId: comment.id,
    };

    it('should have createCommentReply method', async () => {
      expect(commentRepository.createCommentReply).toBeDefined();
      expect(prismaService).toBeDefined();
    });

    it('should have replies', async () => {
      const repliesResponse = await commentRepository.createCommentReply(
        user,
        createReplyDto,
      );

      expect(repliesResponse.length).toBeGreaterThan(0);
    });

    it('should increase replies size', async () => {
      const repliesAfter = await prismaService.comment
        .findUnique({
          where: { id: comment.id },
        })
        .replies();

      expect(repliesBefore.length + 1).toBe(repliesAfter.length);
    });

    it('should return updated replies', async () => {
      const repliesResponse = await commentRepository.createCommentReply(
        user,
        createReplyDto,
      );

      const repliesAfter = await prismaService.comment
        .findUnique({
          where: { id: comment.id },
        })
        .replies();

      expect(repliesResponse[repliesResponse.length - 1].message).toEqual(
        createReplyDto.message,
      );
      expect(repliesResponse.length).toEqual(repliesAfter.length);
    });
  });

  describe('return comment with commenter', () => {
    const createCommentDto: CreateCommentDto = {
      message: `Post is great.`,
      postId: post.id,
    };

    (async () => {
      const comments = await commentRepository.createPostComment(
        user,
        createCommentDto,
      );

      const lastComment = comments.at(-1);

      const result = await commentRepository.findUnique({
        id: lastComment.id,
      });

      it('should return right comment', () => {
        expect(result.message).toEqual(createCommentDto.message);
      });

      it('should return commenter', () => {
        expect(result.commenter).toBeDefined();
      });

      it('returned commenter should be the same as user', () => {
        expect(result.commenter).toEqual(user);
      });
    })();
  });
});
