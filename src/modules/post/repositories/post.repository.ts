import { Injectable } from '@nestjs/common';
import { Post, Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/database/database.service';
import { CreatePostDto } from 'src/modules/post/dto/create-post.dto';
import { UpdatePostDto } from 'src/modules/post/dto/update-post.dto';

@Injectable()
export class PostRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createPost(user: User, createPostDto: CreatePostDto): Promise<Post> {
    return await this.prismaService.post.create({
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

  async findAll(findAllPostInput: Prisma.PostWhereInput) {
    return await this.prismaService.post.findMany({
      where: findAllPostInput,
    });
  }

  async findOne(postUniqueInput: Prisma.PostWhereUniqueInput) {
    return await this.prismaService.post.findFirst({
      where: postUniqueInput,
      include: {
        author: true,
      },
    });
  }

  async update(
    user: User,
    postUniqueInput: Prisma.PostWhereUniqueInput,
    updatePostDto: UpdatePostDto,
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
      .posts();
  }

  async delete(postUniqueInput: Prisma.PostWhereUniqueInput): Promise<Post> {
    return await this.prismaService.post.delete({
      where: postUniqueInput,
    });
  }
}
