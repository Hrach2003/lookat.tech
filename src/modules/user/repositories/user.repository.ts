import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../database/database.service';
import { CreateUserDto } from '../dto/request/create-user.dto';
import { UserView } from './../dto/response/user-default.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async delete<T>(id: number, userSelect = UserView.default<T>()) {
    return await this.prismaService.user.delete({
      where: { id },
      select: userSelect,
    });
  }

  async update<T>(
    id: number,
    updateUserDto: Prisma.UserUpdateInput,
    userSelect = UserView.default<T>(),
  ) {
    return await this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
      select: userSelect,
    });
  }

  async findMany<T>(
    userFindInput: Prisma.UserWhereInput,
    userSelect = UserView.default<T>(),
  ) {
    return await this.prismaService.user.findMany({
      where: userFindInput,
      select: userSelect,
    });
  }

  async findOne<T>(
    userFindUniqueInput: Prisma.UserWhereUniqueInput,
    userSelect = UserView.default<T>(),
  ) {
    return await this.prismaService.user.findFirst({
      where: userFindUniqueInput,
      select: userSelect,
    });
  }

  async findByEmail<T>(email: string, userSelect = UserView.default<T>()) {
    return await this.prismaService.user.findFirst({
      where: { email },
      select: userSelect,
    });
  }

  async createUser<T>(
    createUserDto: CreateUserDto,
    userSelect = UserView.default<T>(),
  ) {
    const user = await this.prismaService.user.create({
      data: createUserDto,
      select: userSelect,
    });

    return user;
  }

  async addFriends<T>(
    userId: number,
    friendIds: number[],
    userSelect = UserView.default<T>(),
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
