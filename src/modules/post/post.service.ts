import { Injectable } from '@nestjs/common';
import { Post, User } from '@prisma/client';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostRepository } from './repositories/post.repository';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async create(user: User, createPostDto: CreatePostDto): Promise<Post> {
    return await this.postRepository.createPost(user, createPostDto);
  }

  async findAll() {
    return await this.postRepository.findAll({});
  }

  async findByUser(user: User): Promise<Post[]> {
    return await this.postRepository.findAll({
      authorId: user.id,
    });
  }

  async findById(id: number): Promise<Post> {
    return await this.postRepository.findOne({ id });
  }

  async update(
    user: User,
    id: number,
    updatePostDto: UpdatePostDto,
  ): Promise<Post[]> {
    return await this.postRepository.update(user, { id }, updatePostDto);
  }

  async remove(id: number) {
    return await this.postRepository.delete({ id });
  }
}
