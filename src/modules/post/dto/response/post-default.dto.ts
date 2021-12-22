import { Prisma } from '@prisma/client';

type BaseView = typeof PostView.fields;

export class PostView {
  static readonly fields = {
    id: true,
    createdAt: true,
    updatedAt: true,
    title: true,
    content: true,
    comments: true,
  };

  static default<T extends Prisma.PostSelect>(select?: T): T & BaseView {
    return {
      ...this.fields,
      ...select,
    };
  }

  static full<T extends Prisma.PostSelect>(select?: T): T & BaseView {
    return {
      ...this.fields,
      comments: true,
      author: true,
      ...select,
    };
  }
}
