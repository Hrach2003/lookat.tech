import { JwtService } from '@nestjs/jwt';
import { TokenDto } from './dto/response/token.dto';
import { ToggleTwoFactorAuthDto } from './dto/request/toggle-two-factor-auth.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User, UserRoleEnum } from '@prisma/client';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { Response } from 'express';
import { UserService } from '../user/user.service';
import { userWithTwoFactorSecret } from '../user/dto/response/user.views';

@Injectable()
export class TwoFactorAuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async generateSecret(user: User) {
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(
      user.email,
      this.configService.get('AUTH_APP_NAME'),
      secret,
    );

    await this.userService.setTwoFactorAuthSecret(user.id, secret);

    return {
      secret,
      otpauthUrl,
    };
  }

  pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }

  async toggleTwoFactorAuthService(
    user: User,
    toggleDto: ToggleTwoFactorAuthDto,
  ) {
    return await this.userService.toggleTwoFactorAuth(user.id, toggleDto);
  }

  async validateTwoFactorAuthCode(user: User, code: string) {
    const userWithSecret = await this.userService.findOne(
      user.id,
      userWithTwoFactorSecret(),
    );

    const isValid = authenticator.verify({
      secret: userWithSecret.twoFactorAuthSecret,
      token: code,
    });

    if (!isValid)
      throw new UnauthorizedException('Wrong authentication code. Try again.');

    return userWithSecret;
  }
}
