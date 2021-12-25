import { Prisma } from '@prisma/client';
import { ViewFactory } from '../../../../common/view/view.factory';

const postView = new ViewFactory<Prisma.PostSelect>();

export const postDefaultView = postView.construct({
  id: true,
  createdAt: true,
  updatedAt: true,
  title: true,
  content: true,
  comments: true,
});
