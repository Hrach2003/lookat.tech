import {
  Body,
  Controller,
  Delete,
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
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { User, UserRoleEnum } from '@prisma/client';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt.guard';
import { RoleGuard } from 'src/core/auth/guards/role.guard';
import { ChangePasswordDto } from 'src/core/user/dto/request/change-password.dto';
import { UserResponseDto } from 'src/core/user/dto/response/user.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { FileUploadDto } from '../../file-upload/dto/file-upload.dto';
import { AddFriendsDto } from './dto/request/add-friends.dto';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @ApiOkResponse({
    type: UserResponseDto,
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const newUser = await this.userService.create(createUserDto);
    return new UserResponseDto(newUser);
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
  @UseGuards(JwtAuthGuard)
  async update(
    @CurrentUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(user.id, updateUserDto);
  }

  @Post('update-password')
  @ApiBody({ type: ChangePasswordDto })
  @ApiOkResponse({ type: UserResponseDto })
  async updatePassword(
    @CurrentUser() user: User,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<UserResponseDto> {
    await this.userService.updatePassword(user, changePasswordDto);
    return new UserResponseDto(user);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.remove(id);
  }

  @Post('upload-avatar')
  @UseGuards(JwtAuthGuard)
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
    const userWithAvatar = await this.userService.uploadAvatar(user, file);

    return new UserResponseDto(userWithAvatar);
  }

  @ApiBody({
    description: "New Friend's ids",
    type: AddFriendsDto,
  })
  @Post('add-friends')
  @UseGuards(JwtAuthGuard)
  async addFriends(
    @Body() addFriendsDto: AddFriendsDto,
    @CurrentUser() user: User,
  ) {
    return await this.userService.addFriends(user.id, addFriendsDto.friendIds);
  }
}
