import { TokenDto } from './../dto/response/token.dto';
import { JwtPayload } from './../types/jwt.type';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { Hash } from '../../../utils/hash.util';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AuthService],
    })
      .useMocker((token) => {
        if (token === JwtService) {
          return { signAsync: () => ({}) };
        }
        if (token === UserService) {
          return { findByEmail: () => ({}) };
        }
      })
      .compile();

    authService = moduleRef.get(AuthService);
    userService = moduleRef.get(UserService);
    jwtService = moduleRef.get(JwtService);
  });

  describe('User validation', () => {
    const user = {
      email: 'hr@gmail.com',
      password: '12345678',
    };

    it('should failed with non existing email', async () => {
      jest.spyOn(userService, 'findByEmail').mockImplementation(() => ({}));

      async function validate() {
        await authService.validateUser(user);
      }

      expect(validate).rejects.toThrowError(UnauthorizedException);
    });

    it('should failed with wrong password', async () => {
      const userWithWrongHashedPassword = {
        email: user.email,
        password: 'wrong_hash',
      };

      jest
        .spyOn(userService, 'findByEmail')
        .mockImplementation(() => userWithWrongHashedPassword);

      async function validate() {
        await authService.validateUser(user);
      }

      expect(validate).rejects.toThrowError(UnauthorizedException);
    });

    it('should return user', async () => {
      const userWithHashedPassword = {
        email: user.email,
        password: await Hash.generate(user.password),
      };

      jest
        .spyOn(userService, 'findByEmail')
        .mockImplementation(() => userWithHashedPassword);

      const authenticatedUser = await authService.validateUser(user);

      expect(authenticatedUser.email).toEqual(userWithHashedPassword.email);
      expect(authenticatedUser.password).toEqual(
        userWithHashedPassword.password,
      );
    });
  });

  describe('Create token', () => {
    const payload: JwtPayload = {
      email: 'hr@gmail.com',
      id: 1,
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
