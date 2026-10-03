import { Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig, Method } from 'axios';
import { Request } from 'express';
import { AppException, generateInternalToken } from '@studypal/service-kit';
import { InternalAuthContext } from '@studypal/types';

@Injectable()
export class ProxyService {
  private readonly internalSecret: string;

  constructor() {
    this.internalSecret =
      process.env.INTERNAL_SERVICE_SECRET ||
      'studypal_dev_internal_service_hmac_secret_32bytes_min';
  }

  async forward<T = any>(
    targetBaseUrl: string,
    targetPath: string,
    req: Request,
    customMethod?: Method,
    customBody?: any,
  ): Promise<T> {
    const method = (customMethod || req.method) as Method;
    const correlationId = (req.headers['x-correlation-id'] as string) || 'unknown';
    const user = (req as any).user as InternalAuthContext | undefined;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-correlation-id': correlationId,
    };

    if (user) {
      const internalToken = generateInternalToken(user, this.internalSecret);
      headers['x-internal-auth'] = internalToken;
    }

    const config: AxiosRequestConfig = {
      baseURL: targetBaseUrl,
      url: targetPath,
      method,
      headers,
      params: req.query,
      data: customBody !== undefined ? customBody : req.body,
      timeout: 15000,
    };

    try {
      const response = await axios.request<T>(config);
      return response.data;
    } catch (err: any) {
      if (err.response) {
        throw new AppException(
          err.response.data?.error?.code || 'GATEWAY_ERROR',
          err.response.data?.error?.message || err.message,
          err.response.status,
          err.response.data?.error?.details,
        );
      }
      throw AppException.internal(`Failed to reach downstream service: ${err.message}`);
    }
  }
}
