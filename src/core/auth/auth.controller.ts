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
import { LoginDto } from 'src/core/auth/dto/login.dto';
import { TokenDto } from 'src/core/auth/dto/token.dto';
import { UserResponseDto } from 'src/core/user/dto/response/user.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt.guard';

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
  getCurrentUser(@CurrentUser() me: User) {
    return new UserResponseDto(me);
  }
}
