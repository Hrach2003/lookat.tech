import { User } from 'src/core/user/entities/user.entity';
import { generateHash } from 'src/utils/hash.util';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo(): typeof User {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>): Promise<void> {
    if (event.entity.password) {
      event.entity.password = await generateHash(event.entity.password);
    }
  }

  async beforeUpdate(event: UpdateEvent<User>): Promise<void> {
    if (event.entity?.password !== event.databaseEntity.password) {
      event.entity.password = await generateHash(event.entity.password);
    }
  }
}
