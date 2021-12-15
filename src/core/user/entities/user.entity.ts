import { Exclude } from 'class-transformer';
import { AbstractAuditEntity } from 'src/common/abstract.entity';
import { RolesEnum } from 'src/core/user/entities/role.enum';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

@Entity()
export class User extends AbstractAuditEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @ManyToMany(() => User, (user) => user.friends)
  @JoinTable({
    name: 'user_friends',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'friend_id',
      referencedColumnName: 'id',
    },
  })
  friends: User[];

  @Column({ type: 'enum', enum: RolesEnum, default: RolesEnum.USER })
  role: RolesEnum;
}
