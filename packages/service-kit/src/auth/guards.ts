import {
  Injectable,
  CanActivate,
  ExecutionContext,
  SetMetadata,
  createParamDecorator,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { InternalAuthContext, UserRole } from '@studypal/types';
import { AppException } from '../errors/app-exception.js';
import { verifyInternalToken } from './internal-token.js';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

export const CurrentUser = createParamDecorator(
  (data: keyof InternalAuthContext | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as InternalAuthContext;
    return data ? user?.[data] : user;
  },
);

@Injectable()
export class InternalAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = (request.headers['x-internal-auth'] ||
      request.headers['authorization']) as string | undefined;

    if (!authHeader) {
      throw AppException.unauthorized('Missing internal authentication header');
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
    const secret = process.env.INTERNAL_SERVICE_SECRET || 'studypal_dev_internal_service_hmac_secret_32bytes_min';

    try {
      const authContext = verifyInternalToken(token, secret);
      (request as any).user = authContext;
      return true;
    } catch (err: any) {
      throw AppException.unauthorized(`Invalid internal credentials: ${err.message}`);
    }
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user as InternalAuthContext | undefined;

    if (!user) {
      throw AppException.unauthorized('User not authenticated');
    }

    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole) {
      throw AppException.forbidden(`Role ${user.role} does not have required permissions: [${requiredRoles.join(', ')}]`);
    }

    return true;
  }
}
