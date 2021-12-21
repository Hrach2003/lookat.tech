import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'database/database.service';
import { UserDefaultView } from 'modules/user/dto/response/user-default.dto';
import { CreateUserDto } from '../dto/request/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async delete(id: number, userSelect = new UserDefaultView()) {
    return await this.prismaService.user.delete({
      where: { id },
      select: userSelect,
    });
  }

  async update(
    id: number,
    updateUserDto: Prisma.UserUpdateInput,
    userSelect = new UserDefaultView(),
  ) {
    return await this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
      select: userSelect,
    });
  }

  async findMany(
    userFindInput: Prisma.UserWhereInput,
    userSelect = new UserDefaultView(),
  ) {
    return await this.prismaService.user.findMany({
      where: userFindInput,
      select: userSelect,
    });
  }

  async findOne(
    userFindUniqueInput: Prisma.UserWhereUniqueInput,
    userSelect = new UserDefaultView(),
  ) {
    return await this.prismaService.user.findFirst({
      where: userFindUniqueInput,
      select: userSelect,
    });
  }

  async findByEmail(email: string, userSelect = new UserDefaultView()) {
    return await this.prismaService.user.findFirst({
      where: { email },
      select: userSelect,
    });
  }

  async createUser(
    createUserDto: CreateUserDto,
    userSelect = new UserDefaultView(),
  ) {
    const user = await this.prismaService.user.create({
      data: createUserDto,
      select: userSelect,
    });

    return user;
  }

  async addFriends(
    userId: number,
    friendIds: number[],
    userSelect = new UserDefaultView(),
  ) {
    return await this.prismaService.user.update({
      where: { id: userId },
      select: userSelect,
      data: {
        friends: {
          connect: friendIds.map((id) => ({ id })),
        },
      },
    });
  }
}
