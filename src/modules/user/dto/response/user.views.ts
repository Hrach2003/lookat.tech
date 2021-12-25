import { ViewFactory } from './../../../../common/view/view.factory';
import { Prisma } from '@prisma/client';

const userView = new ViewFactory<Prisma.UserSelect>();

export const userDefaultView = userView.construct({
  id: true,
  createdAt: true,
  updatedAt: true,
  name: true,
  email: true,
  avatar: true,
  role: true,
});

export const userFullView = userView.construct({
  ...userDefaultView(),
  posts: true,
  friends: true,
  comments: true,
});
