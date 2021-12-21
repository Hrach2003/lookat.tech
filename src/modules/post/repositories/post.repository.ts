import { Injectable } from '@nestjs/common';
import { Post, Prisma, User } from '@prisma/client';
import { paginationQuery } from 'common/pagination.query';
import { PrismaService } from 'database/database.service';
import { CreatePostDto } from 'modules/post/dto/request/create-post.dto';
import { PostPaginationRequest } from 'modules/post/dto/response/pagination-post.dto';
import { UpdatePostDto } from 'modules/post/dto/request/update-post.dto';
import { PostDefaultView } from 'modules/post/dto/response/post-default.dto';

@Injectable()
export class PostRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createPost(
    user: User,
    createPostDto: CreatePostDto,
    postSelect = new PostDefaultView(),
  ): Promise<Post> {
    return await this.prismaService.post.create({
      select: postSelect,
      data: {
        ...createPostDto,
        author: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  }

  async findAll(
    postInput: Prisma.PostWhereInput,
    postSelect = new PostDefaultView(),
  ) {
    return await this.prismaService.post.findMany({
      select: postSelect,
      where: postInput,
    });
  }

  async findOne(
    postUniqueInput: Prisma.PostWhereUniqueInput,
    postSelect = new PostDefaultView(),
  ) {
    return await this.prismaService.post.findFirst({
      select: postSelect,
      where: postUniqueInput,
    });
  }

  async filter(postPaginationRequest: PostPaginationRequest) {
    return await this.prismaService.post.findMany({
      ...paginationQuery(postPaginationRequest),
    });
  }

  async getCount() {
    return await this.prismaService.post.count();
  }

  async update(
    user: User,
    postUniqueInput: Prisma.PostWhereUniqueInput,
    updatePostDto: UpdatePostDto,
    postSelect = new PostDefaultView(),
  ) {
    return await this.prismaService.user
      .update({
        where: { id: user.id },
        data: {
          posts: {
            update: {
              where: postUniqueInput,
              data: updatePostDto,
            },
          },
        },
      })
      .posts({ select: postSelect });
  }

  async delete(
    postUniqueInput: Prisma.PostWhereUniqueInput,
    postSelect = new PostDefaultView(),
  ): Promise<Post> {
    return await this.prismaService.post.delete({
      where: postUniqueInput,
      select: postSelect,
    });
  }
}
