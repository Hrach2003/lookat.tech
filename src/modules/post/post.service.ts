import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreatePostDto } from './dto/request/create-post.dto';
import { UpdatePostDto } from './dto/request/update-post.dto';
import { PostPaginationRequest } from './dto/response/pagination-post.dto';
import { PostRepository } from './repositories/post.repository';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async create(user: User, createPostDto: CreatePostDto) {
    return await this.postRepository.createPost(user, createPostDto);
  }

  async findAll() {
    return await this.postRepository.findAll({});
  }

  async findByUser(user: User) {
    return await this.postRepository.findAll({
      authorId: user.id,
    });
  }

  async findById(id: number) {
    return await this.postRepository.findOne({ id });
  }

  async filter(postPaginationRequest: PostPaginationRequest) {
    const count = await this.postRepository.getCount();
    const posts = await this.postRepository.filter(postPaginationRequest);

    return { count, posts };
  }

  async update(user: User, id: number, updatePostDto: UpdatePostDto) {
    return await this.postRepository.update(user, { id }, updatePostDto);
  }

  async remove(id: number) {
    return await this.postRepository.delete({ id });
  }
}
