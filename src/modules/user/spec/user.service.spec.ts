import { ConflictException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { UserRoleEnum } from '@prisma/client';
import { AppConfigModule } from '../../../config/config.module';
import { PrismaService } from '../../../database/database.service';
import { FileUploadService } from '../../../file-upload/file-upload.service';
import { AuthModule } from '../../auth/auth.module';
import { AuthService } from '../../auth/auth.service';
import { UserView } from '../dto/response/user-default.dto';
import { CreateUserDto } from './../dto/request/create-user.dto';
import { UserRepository } from './../repositories/user.repository';
import { UserService } from './../user.service';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AuthModule, AppConfigModule],
      providers: [UserService, UserRepository, PrismaService],
    })
      .useMocker((token) => {
        if (
          token === AuthService ||
          token === UserRepository ||
          token === FileUploadService
        ) {
          return {};
        }
      })
      .compile();

    userService = moduleRef.get(UserService);
    userRepository = moduleRef.get(UserRepository);
  });

  describe('user create flow', () => {
    const createUserDto: CreateUserDto = {
      email: 'hr@gmail.com',
      name: 'hr',
      password: '12345678',
      role: UserRoleEnum.USER,
    };

    it('should throw conflict email exists', async () => {
      jest
        .spyOn(userRepository, 'findByEmail')
        .mockImplementationOnce(() => true);

      async function create() {
        await userService.create(createUserDto);
      }

      expect(create).rejects.toThrowError(ConflictException);
    });

    it('should hash password and return created user', async () => {
      jest
        .spyOn(userRepository, 'findByEmail')
        .mockImplementationOnce(() => false);

      jest
        .spyOn(userRepository, 'createUser')
        .mockImplementationOnce((user) => user);

      const notHashedPassword = createUserDto.password;
      const user = await userService.create(
        createUserDto,
        UserView.default({
          password: true,
        }),
      );

      expect(user.email).toBe(createUserDto.email);
      expect(user.name).toBe(createUserDto.name);
      expect(user.password).not.toBe(notHashedPassword);
    });
  });
});
