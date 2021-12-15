import { SetMetadata } from '@nestjs/common';
import { RolesEnum } from 'src/core/user/entities/role.enum';

export const ROLE_META_KEY = 'role_meta_key';
export const Roles = (...roles: RolesEnum[]) =>
  SetMetadata(ROLE_META_KEY, roles);
