import { ViewFactory } from '../../../../common/view/view.factory';
import { Prisma } from '@prisma/client';

const commentView = new ViewFactory<Prisma.CommentSelect>();

export const commentDefaultView = commentView.construct({
  id: true,
  createdAt: true,
  updatedAt: true,
  message: true,
});
