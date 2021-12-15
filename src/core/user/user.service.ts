import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/core/user/entities/user.entity';
import { FileUploadService } from '../../file-upload/file-upload.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './entities/user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existsEmail = await this.userRepository.findByEmail(
      createUserDto.email,
    );

    if (existsEmail) throw new ConflictException('Email already exists.');

    return await this.userRepository.createUser(createUserDto);
  }

  async addFriends(userId: number, friendIds: number[]) {
    return await this.userRepository.addFriends(userId, friendIds);
  }

  async findAll() {
    return await this.userRepository.find({});
  }

  async findOne(id: number) {
    return await this.userRepository.findOne(id);
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findByEmail(email);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    const deleteResponse = await this.userRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new NotFoundException('User not found');
    }
  }

  async uploadAvatar(file: Express.Multer.File) {
    return await this.fileUploadService.uploadFile(file);
  }
}
