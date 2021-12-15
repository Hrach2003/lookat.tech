import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { plainToClass } from 'class-transformer';
import { Logger } from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private readonly logger = new Logger(UserRepository.name);

  findByEmail(email: string) {
    return this.findOne({ email });
  }

  async createUser(createUserDto: CreateUserDto) {
    const user = plainToClass(User, createUserDto);
    const newUser = this.create(user);

    await this.save(newUser);
    return newUser;
    // return await this.createQueryBuilder('user')
    //   .insert()
    //   .values({
    //     name: createUserDto.name,
    //     email: createUserDto.email,
    //   })
    //   .execute();
  }

  async addFriends(userId: number, friendIds: number[]) {
    const userWithFriends = await this.findOne(userId);

    const newFriends: User[] = await this.createQueryBuilder('user')
      .where('user.id IN (...ids)', { ids: friendIds })
      .execute();

    return await this.createQueryBuilder()
      .update()
      .set({
        friends: [...userWithFriends.friends, ...newFriends],
      })
      .execute();
  }
}
