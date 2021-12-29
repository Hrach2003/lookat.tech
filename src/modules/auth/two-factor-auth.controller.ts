import { AuthService } from './auth.service';
import { ToggleTwoFactorAuthDto } from './dto/request/toggle-two-factor-auth.dto';
import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Response } from 'express';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { JwtAuthGuard } from './guards/jwt.guard';
import { TwoFactorAuthService } from './two-factor-auth.service';
import { AuthCodeDto } from './dto/request/authentication-code.dto';

@Controller('two-factor-auth')
@ApiTags('two-factor-auth')
export class TwoFactorAuthController {
  constructor(
    private readonly twoFactorAuthService: TwoFactorAuthService,
    private readonly authService: AuthService,
  ) {}

  @Get('generate')
  @UseGuards(JwtAuthGuard)
  async twoFactorAuth(@CurrentUser() user: User, @Res() response: Response) {
    const { otpauthUrl } = await this.twoFactorAuthService.generateSecret(user);
    return this.twoFactorAuthService.pipeQrCodeStream(response, otpauthUrl);
  }

  @Post('toggle')
  @UseGuards(JwtAuthGuard)
  async toggleTwoFactorAuth(
    @Body() toggleDto: ToggleTwoFactorAuthDto,
    @CurrentUser() user: User,
  ) {
    return await this.twoFactorAuthService.toggleTwoFactorAuthService(
      user,
      toggleDto,
    );
  }

  @Post('authenticate')
  @UseGuards(JwtAuthGuard)
  async authenticate(@Body() codeDto: AuthCodeDto, @CurrentUser() user: User) {
    const userWithSecret =
      await this.twoFactorAuthService.validateTwoFactorAuthCode(
        user,
        codeDto.code,
      );

    return await this.authService.createToken({
      isTwoFactorAuthEnabled: true,
      role: userWithSecret.role,
      userId: userWithSecret.id,
    });
  }
}
