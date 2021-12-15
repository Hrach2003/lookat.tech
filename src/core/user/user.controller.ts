import {
  Body,
  Controller,
  Delete,
  Get,
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
import { JwtAuthGuard } from 'src/core/auth/guards/jwt.guard';
import { RoleGuard } from 'src/core/auth/guards/role.guard';
import { RolesEnum } from 'src/core/user/entities/role.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { FileUploadDto } from '../../file-upload/dto/file-upload.dto';
import { AddFriendsDto } from './dto/add-friends.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Get()
  @Roles(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.remove(id);
  }

  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'User avatar',
    type: FileUploadDto,
  })
  async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    return await this.userService.uploadAvatar(file);
  }

  @Post('add-friends')
  @ApiBody({
    description: "New Friend's ids",
    type: AddFriendsDto,
  })
  async addFriends(
    @Param('id', ParseIntPipe) userId: number,
    @Body() addFriendsDto: AddFriendsDto,
  ) {
    return await this.userService.addFriends(userId, addFriendsDto.friendIds);
  }
}
