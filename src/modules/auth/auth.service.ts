import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Hash } from '../../utils/hash.util';
import { userWithPassword } from '../user/dto/response/user.views';
import { UserRepository } from '../user/repositories/user.repository';
import { LoginDto } from './dto/request/login.dto';
import { TokenDto } from './dto/response/token.dto';
import { JwtPayload } from './types/jwt.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginDto) {
    const user = await this.userRepository.findByEmail(
      loginDto.email,
      userWithPassword(),
    );

    const isPasswordsMatch = await Hash.compare(
      loginDto.password,
      user?.password || '',
    );

    if (!isPasswordsMatch)
      throw new UnauthorizedException('Password and/or Email are wrong.');

    return user;
  }

  async createToken(user: { email: string; id: number }): Promise<TokenDto> {
    const payload: JwtPayload = {
      email: user.email,
      id: user.id,
    };

    return new TokenDto({
      accessToken: await this.jwtService.signAsync(payload),
    });
  }
}
