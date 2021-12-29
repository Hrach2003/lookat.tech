import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { User, UserRoleEnum } from '@prisma/client';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { Roles } from '../../decorators/roles.decorator';
import { FileUploadDto } from '../../file-upload/dto/file-upload.dto';
import { JwtTwoFactorGuard } from '../auth/guards/jwt-two-factor.guard';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { AddFriendsDto } from './dto/request/add-friends.dto';
import { ChangePasswordDto } from './dto/request/change-password.dto';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Get()
  @Roles(UserRoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtTwoFactorGuard)
  async update(
    @CurrentUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(user.id, updateUserDto);
  }

  @Post('update-password')
  @ApiBody({ type: ChangePasswordDto })
  @UseGuards(JwtTwoFactorGuard)
  async updatePassword(
    @CurrentUser() user: User,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return await this.userService.updatePassword(user, changePasswordDto);
  }

  @Post('upload-avatar')
  @UseGuards(JwtTwoFactorGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'User avatar',
    type: FileUploadDto,
  })
  async uploadAvatar(
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    this.logger.debug(`FileName ${file.originalname} ${file.size}`);
    return await this.userService.uploadAvatar(user, file);
  }

  @ApiBody({
    description: "New Friend's ids",
    type: AddFriendsDto,
  })
  @Post('add-friends')
  @UseGuards(JwtTwoFactorGuard)
  async addFriends(
    @Body() addFriendsDto: AddFriendsDto,
    @CurrentUser() user: User,
  ) {
    return await this.userService.addFriends(user.id, addFriendsDto.friendIds);
  }
}
