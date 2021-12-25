import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Hash } from '../../utils/hash.util';
import { userDefaultView } from '../user/dto/response/user.views';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/request/login.dto';
import { TokenDto } from './dto/response/token.dto';
import { JwtPayload } from './types/jwt.type';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(
      loginDto.email,
      userDefaultView({
        password: true,
      }),
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
