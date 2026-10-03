import {
  Injectable,
  CanActivate,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { AppException, generateInternalToken } from '@studypal/service-kit';
import { AuthenticatedUserPayload, InternalAuthContext } from '@studypal/types';

export const IS_PUBLIC_KEY = 'isGatewayPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class GatewayJwtGuard implements CanActivate {
  private readonly jwtSecret: string;
  private readonly internalSecret: string;

  constructor(private readonly reflector: Reflector) {
    this.jwtSecret =
      process.env.JWT_ACCESS_SECRET ||
      'studypal_dev_access_token_secret_which_is_very_secure_32bytes';
    this.internalSecret =
      process.env.INTERNAL_SERVICE_SECRET ||
      'studypal_dev_internal_service_hmac_secret_32bytes_min';
  }

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest<Request>();
    const correlationId = (request.headers['x-correlation-id'] as string) || 'gateway-cid';

    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      if (isPublic) return true;
      throw AppException.unauthorized('Authorization header missing');
    }

    if (!authHeader.startsWith('Bearer ')) {
      if (isPublic) return true;
      throw AppException.unauthorized('Invalid authorization scheme');
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, this.jwtSecret) as AuthenticatedUserPayload;

      const internalContext: InternalAuthContext = {
        userId: decoded.sub,
        email: decoded.email,
        role: decoded.role,
        studentProfileId: decoded.studentProfileId,
        correlationId,
        timestamp: Date.now(),
      };

      (request as any).user = internalContext;

      // Generate signed internal token and attach to downstream header
      const internalToken = generateInternalToken(internalContext, this.internalSecret);
      request.headers['x-internal-auth'] = internalToken;

      return true;
    } catch (err: any) {
      if (isPublic) return true;
      if (err.name === 'TokenExpiredError') {
        throw new AppException('TOKEN_EXPIRED', 'Access token has expired', 401);
      }
      throw AppException.unauthorized('Invalid access token');
    }
  }
}
