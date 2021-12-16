import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/database.service';
import { CreateUserDto } from '../dto/request/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async delete(id: number) {
    return await this.prismaService.user.delete({
      where: { id },
    });
  }

  async update(id: number, updateUserDto: Prisma.UserUpdateInput) {
    return await this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async findMany(userFindInput: Prisma.UserWhereInput) {
    return await this.prismaService.user.findMany({
      where: userFindInput,
    });
  }

  async findOne(userFindInput: Prisma.UserWhereInput) {
    return await this.prismaService.user.findFirst({
      where: userFindInput,
    });
  }

  async findByEmail(email: string) {
    return await this.prismaService.user.findFirst({
      where: { email },
    });
  }

  async createUser(createUserDto: CreateUserDto) {
    const user = await this.prismaService.user.create({
      data: createUserDto,
    });

    return user;
  }

  async addFriends(userId: number, friendIds: number[]) {
    const updatedUser = await this.prismaService.user.update({
      where: { id: userId },
      include: {
        friends: true,
      },
      data: {
        friends: {
          connect: friendIds.map((id) => ({ id })),
        },
      },
    });

    return updatedUser;
  }
}
