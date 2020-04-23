import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './user.entity';
import { UserRoles } from './user-roles.enum';
import { Manager } from './manager.model';
import { Admin } from './admin.model';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);

export const GetManager = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Manager => {
    const req = ctx.switchToHttp().getRequest();
    const user: User = req.user;
    if (!user.isManager()) {
      throw new UnauthorizedException();
    }
    return user as Manager;
  },
);

export const GetAdmin = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Admin => {
    const req = ctx.switchToHttp().getRequest();
    const user: User = req.user;
    if (!user.isAdmin()) {
      throw new UnauthorizedException();
    }
    return user as Admin;
  },
);
