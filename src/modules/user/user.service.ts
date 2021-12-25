import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { FileUploadService } from '../../file-upload/file-upload.service';
import { Hash } from '../../utils/hash.util';
import { AuthService } from '../auth/auth.service';
import { ChangePasswordDto } from './dto/request/change-password.dto';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { userDefaultView } from './dto/response/user.views';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly userRepository: UserRepository,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async create<T>(
    createUserDto: CreateUserDto,
    userSelect: T = userDefaultView(),
  ) {
    const existsEmail = await this.userRepository.findByEmail(
      createUserDto.email,
    );

    if (existsEmail) throw new ConflictException('Email already exists.');

    const hashedPassword = await Hash.generate(createUserDto.password);
    createUserDto.password = hashedPassword;

    return await this.userRepository.createUser<T>(createUserDto, userSelect);
  }

  async addFriends<T>(userId: number, friendIds: number[]) {
    return await this.userRepository.addFriends<T>(userId, friendIds);
  }

  async findAll<T>() {
    return await this.userRepository.findMany<T>({});
  }

  async findOne<T>(id: number) {
    return await this.userRepository.findOne<T>({ id });
  }

  async findByEmail<T>(email: string, userSelect: T = userDefaultView()) {
    return await this.userRepository.findByEmail<T>(email, userSelect);
  }

  async update<T>(id: number, updateUserDto: UpdateUserDto) {
    return await this.userRepository.update<T>(id, updateUserDto);
  }

  async updatePassword<T>(user: User, changePasswordDto: ChangePasswordDto) {
    await this.authService.validateUser({
      email: user.email,
      password: changePasswordDto.currentPassword,
    });

    return await this.userRepository.update<T>(user.id, {
      password: changePasswordDto.newPassword,
    });
  }

  async remove<T>(id: number) {
    const deleteResponse = await this.userRepository.delete<T>(id);
    if (!deleteResponse) throw new NotFoundException('User not found');
  }

  async uploadAvatar<T>(user: User, file: Express.Multer.File) {
    const imageUrl = await this.fileUploadService.uploadFile(file);
    return await this.userRepository.update<T>(user.id, { avatar: imageUrl });
  }
}
