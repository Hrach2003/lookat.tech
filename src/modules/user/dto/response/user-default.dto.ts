import { Prisma } from '@prisma/client';

type BaseView = typeof UserView.fields;

export abstract class UserView {
  static readonly fields = {
    id: true,
    createdAt: true,
    updatedAt: true,
    name: true,
    email: true,
    avatar: true,
    role: true,
  };

  static default<T extends Prisma.UserSelect>(select?: T): T & BaseView {
    return {
      ...this.fields,
      ...select,
    };
  }

  static full<T extends Prisma.UserSelect>(select?: T): T & BaseView {
    return {
      ...this.fields,
      friends: true,
      posts: true,
      replies: true,
      comments: true,
      ...select,
    };
  }
}
