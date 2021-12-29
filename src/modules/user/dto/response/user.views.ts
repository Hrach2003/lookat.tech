import { Prisma } from '@prisma/client';
import { ViewFactory } from './../../../../common/view/view.factory';

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

export const userWithPassword = userView.construct({
  ...userDefaultView(),
  password: true,
});

export const userWithTwoFactorSecret = userView.construct({
  ...userDefaultView(),
  twoFactorAuthSecret: true,
});
