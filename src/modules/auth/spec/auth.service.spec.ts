import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { User, UserRoleEnum } from '@prisma/client';
import { Hash } from '../../../utils/hash.util';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';
import { TokenDto } from './../dto/response/token.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let user;

  beforeEach(() => {
    user = {
      email: user.email,
      password: 'wrong_hash',
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'hr',
      avatar: null,
      role: UserRoleEnum.USER,
    };
  });

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AuthService],
    })
      .overrideProvider(JwtService)
      .useValue({ signAsync: () => ({}) })
      .overrideProvider(UserService)
      .useValue({ findByEmail: () => ({}) })
      .compile();

    authService = moduleRef.get(AuthService);
    userService = moduleRef.get(UserService);
    jwtService = moduleRef.get(JwtService);
  });

  describe('User validation', () => {
    // const user = {
    //   email: 'hr@gmail.com',
    //   password: '12345678',
    // };

    it('should failed with non existing email', async () => {
      jest.spyOn(userService, 'findByEmail').mockImplementation(() => user);

      async function validate() {
        await authService.validateUser(user);
      }

      expect(validate).rejects.toThrowError(UnauthorizedException);
    });

    it('should failed with wrong password', async () => {
      const userWithWrongHashedPassword = {
        email: user.email,
        password: 'wrong_hash',
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'hr',
        avatar: null,
        role: UserRoleEnum.USER,
      };

      jest
        .spyOn(userService, 'findByEmail')
        .mockImplementation(async () => userWithWrongHashedPassword);

      async function validate() {
        await authService.validateUser(user);
      }

      expect(validate).rejects.toThrowError(UnauthorizedException);
    });

    it('should return user', async () => {
      const userWithHashedPassword = {
        email: user.email,
        password: await Hash.generate(user.password),
      } as User;

      jest
        .spyOn(userService, 'findByEmail')
        .mockImplementation(async () => userWithHashedPassword);

      const authenticatedUser = await authService.validateUser(user);

      expect(authenticatedUser.email).toEqual(userWithHashedPassword.email);
      expect(authenticatedUser.password).toEqual(
        userWithHashedPassword.password,
      );
    });
  });

  describe('Create token', () => {
    const payload = {
      role: UserRoleEnum.ADMIN,
      userId: 1,
      isTwoFactorAuthEnabled: false,
    };

    it('should return TokenDto', async () => {
      const tokenDto = await authService.createToken(payload);

      expect(tokenDto).toBeInstanceOf(TokenDto);
    });

    it('should return right access token', async () => {
      const token = 'access_token';

      jest
        .spyOn(jwtService, 'signAsync')
        .mockImplementation(() => Promise.resolve(token));

      const tokenDto = await authService.createToken(payload);

      expect(tokenDto.accessToken).toEqual(token);
    });
  });
});
