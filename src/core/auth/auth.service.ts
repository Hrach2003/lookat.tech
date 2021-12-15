import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/core/auth/dto/login.dto';
import { TokenDto } from 'src/core/auth/dto/token.dto';
import { JwtPayload } from 'src/core/auth/types/jwt.type';
import { User } from 'src/core/user/entities/user.entity';
import { UserService } from '../user/user.service';
import { compareHash } from '../../utils/hash.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<User> {
    const user = await this.userService.findByEmail(loginDto.email);

    const isPasswordsMatch = await compareHash(
      loginDto.password,
      user?.password,
    );

    if (!isPasswordsMatch)
      throw new UnauthorizedException('Password and/or Email are wrong.');

    return user;
  }

  async createToken(user: User): Promise<TokenDto> {
    const payload: JwtPayload = {
      email: user.email,
      id: user.id,
    };

    return new TokenDto({
      accessToken: await this.jwtService.signAsync(payload),
    });
  }
}
