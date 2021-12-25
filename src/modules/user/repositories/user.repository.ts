import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { TrueFields } from '../../../common/view/view.factory';
import { PrismaService } from '../../../database/database.service';
import { CreateUserDto } from '../dto/request/create-user.dto';
import { userDefaultView } from '../dto/response/user.views';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async delete<T extends TrueFields<Prisma.UserSelect>>(
    id: number,
    userSelect?: T,
  ) {
    return await this.prismaService.user.delete({
      where: { id },
      select: userSelect || userDefaultView(),
    });
  }

  async update<T extends TrueFields<Prisma.UserSelect>>(
    id: number,
    updateUserDto: Prisma.UserUpdateInput,
    userSelect?: T,
  ) {
    return await this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
      select: userSelect || userDefaultView(),
    });
  }

  async findMany<T extends TrueFields<Prisma.UserSelect>>(
    userFindInput: Prisma.UserWhereInput,
    userSelect?: T,
  ) {
    return await this.prismaService.user.findMany({
      where: userFindInput,
      select: userSelect || userDefaultView(),
    });
  }

  async findOne<T extends TrueFields<Prisma.UserSelect>>(
    userFindUniqueInput: Prisma.UserWhereUniqueInput,
    userSelect?: T,
  ) {
    return await this.prismaService.user.findFirst({
      where: userFindUniqueInput,
      select: userSelect || userDefaultView(),
    });
  }

  async findByEmail<T extends TrueFields<Prisma.UserSelect>>(
    email: string,
    userSelect?: T,
  ) {
    return await this.prismaService.user.findFirst({
      where: { email },
      select: userSelect || userDefaultView(),
    });
  }

  async createUser<T extends TrueFields<Prisma.UserSelect>>(
    createUserDto: CreateUserDto,
    userSelect?: T,
  ) {
    const user = await this.prismaService.user.create({
      data: createUserDto,
      select: userSelect || userDefaultView(),
    });

    return user;
  }

  async addFriends<T extends TrueFields<Prisma.UserSelect>>(
    userId: number,
    friendIds: number[],
    userSelect?: T,
  ) {
    return await this.prismaService.user.update({
      where: { id: userId },
      select: userSelect || userDefaultView(),
      data: {
        friends: {
          connect: friendIds.map((id) => ({ id })),
        },
      },
    });
  }
}
