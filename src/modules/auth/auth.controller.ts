import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/request/login.dto';
import { TokenDto } from './dto/response/token.dto';
import { JwtTwoFactorGuard } from './guards/jwt-two-factor.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: TokenDto,
    description: 'User info with access token',
  })
  async login(@Body() loginDto: LoginDto): Promise<TokenDto> {
    const user = await this.authService.validateUser(loginDto);

    return await this.authService.createToken({
      role: user.role,
      userId: user.id,
      isTwoFactorAuthEnabled: user.isTwoFactorEnabled,
    });
  }

  @Get('me')
  @UseGuards(JwtTwoFactorGuard)
  getCurrentUser(@CurrentUser() me: User) {
    return me;
  }
}
