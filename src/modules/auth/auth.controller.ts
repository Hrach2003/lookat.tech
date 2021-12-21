import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { LoginDto } from 'modules/auth/dto/request/login.dto';
import { TokenDto } from 'modules/auth/dto/response/token.dto';
import { CurrentUser } from 'decorators/current-user.decorator';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { UserDefaultView } from 'modules/user/dto/response/user-default.dto';

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
    return await this.authService.createToken(user);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: UserDefaultView })
  getCurrentUser(@CurrentUser() me: User) {
    return me;
  }
}
