import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { TokenDto } from 'src/modules/auth/dto/token.dto';
import { JwtPayload } from 'src/modules/auth/types/jwt.type';
import { Hash } from 'src/utils/hash.util';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<User> {
    const user = await this.userService.findByEmail(loginDto.email);

    const isPasswordsMatch = await Hash.compare(
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
