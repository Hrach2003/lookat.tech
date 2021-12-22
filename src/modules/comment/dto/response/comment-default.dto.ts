import { Prisma } from '@prisma/client';

type BaseView = typeof CommentView.fields;
export class CommentView {
  static readonly fields = {
    id: true,
    createdAt: true,
    updatedAt: true,
    message: true,
  };

  static default<T extends Prisma.CommentSelect>(select?: T): T & BaseView {
    return {
      ...this.fields,
      ...select,
    };
  }
}
