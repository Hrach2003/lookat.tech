import { UserRoleEnum } from '@prisma/client';

export type JwtPayload = {
  id: number;
  role: UserRoleEnum;
  isTwoFactorAuthEnabled: boolean;
};
