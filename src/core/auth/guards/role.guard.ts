import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User, UserRoleEnum } from '@prisma/client';
import { ROLE_META_KEY } from './../../../decorators/roles.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  private readonly logger = new Logger(RoleGuard.name);
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): Promise<boolean> | boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRoleEnum[]>(
      ROLE_META_KEY,
      [context.getClass(), context.getHandler()],
    );

    this.logger.debug(requiredRoles);

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest<Express.Request>();
    const user = request.user as User;

    this.logger.debug(user.role);

    return requiredRoles.includes(user.role);
  }
}
