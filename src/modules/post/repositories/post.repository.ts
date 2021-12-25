import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { paginationQuery } from '../../../common/pagination/pagination.query';
import { PrismaService } from '../../../database/database.service';
import { CreatePostDto } from '../dto/request/create-post.dto';
import { UpdatePostDto } from '../dto/request/update-post.dto';
import { PostPaginationRequest } from '../dto/response/pagination-post.dto';
import { postDefaultView } from '../dto/response/post.views';

@Injectable()
export class PostRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createPost<T>(
    user: User,
    createPostDto: CreatePostDto,
    postSelect: T = postDefaultView(),
  ) {
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

  async findAll<T>(
    postInput: Prisma.PostWhereInput,
    postSelect: T = postDefaultView(),
  ) {
    return await this.prismaService.post.findMany({
      select: postSelect,
      where: postInput,
    });
  }

  async findOne<T>(
    postUniqueInput: Prisma.PostWhereUniqueInput,
    postSelect: T = postDefaultView(),
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

  async update<T>(
    user: User,
    postUniqueInput: Prisma.PostWhereUniqueInput,
    updatePostDto: UpdatePostDto,
    postSelect: T = postDefaultView(),
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

  async delete<T>(
    postUniqueInput: Prisma.PostWhereUniqueInput,
    postSelect: T = postDefaultView(),
  ) {
    return await this.prismaService.post.delete({
      where: postUniqueInput,
      select: postSelect,
    });
  }
}
