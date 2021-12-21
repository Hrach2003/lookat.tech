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
import { JwtAuthGuard } from 'modules/auth/guards/jwt.guard';
import { RoleGuard } from 'modules/auth/guards/role.guard';
import { ChangePasswordDto } from 'modules/user/dto/request/change-password.dto';
import { CurrentUser } from 'decorators/current-user.decorator';
import { Roles } from 'decorators/roles.decorator';
import { FileUploadDto } from '../../file-upload/dto/file-upload.dto';
import { AddFriendsDto } from './dto/request/add-friends.dto';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { UserService } from './user.service';
import { UserDefaultView } from 'modules/user/dto/response/user-default.dto';

@Controller('user')
@ApiTags('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Post('create')
  @ApiOkResponse({
    type: UserDefaultView,
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.create(createUserDto);
  }

  @Get()
  @Roles(UserRoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({
    type: [UserDefaultView],
  })
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    type: UserDefaultView,
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return await this.userService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: UserDefaultView,
  })
  async update(
    @CurrentUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.update(user.id, updateUserDto);
  }

  @Post('update-password')
  @ApiBody({ type: ChangePasswordDto })
  @ApiOkResponse({ type: UserDefaultView })
  async updatePassword(
    @CurrentUser() user: User,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<User> {
    return await this.userService.updatePassword(user, changePasswordDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: Boolean })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.userService.remove(id);
    return true;
  }

  @Post('upload-avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'User avatar',
    type: FileUploadDto,
  })
  @ApiOkResponse({ type: UserDefaultView })
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
  @ApiOkResponse({ type: UserDefaultView })
  @Post('add-friends')
  @UseGuards(JwtAuthGuard)
  async addFriends(
    @Body() addFriendsDto: AddFriendsDto,
    @CurrentUser() user: User,
  ): Promise<User> {
    return await this.userService.addFriends(user.id, addFriendsDto.friendIds);
  }
}
