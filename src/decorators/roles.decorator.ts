import { SetMetadata } from '@nestjs/common';
import { UserRoleEnum } from '@prisma/client';

export const ROLE_META_KEY = 'role_meta_key';
export const Roles = (...roles: UserRoleEnum[]) =>
  SetMetadata(ROLE_META_KEY, roles);
