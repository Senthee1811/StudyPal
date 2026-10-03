import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppException } from './app-exception.js';
import { ApiStandardResponse } from '@studypal/types';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const correlationId = (request.headers['x-correlation-id'] as string) || 'unknown';

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_SERVER_ERROR';
    let message = 'An unexpected internal error occurred';
    let details: any = undefined;

    if (exception instanceof AppException) {
      status = exception.getStatus();
      code = exception.code;
      message = exception.message;
      details = exception.details;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse() as any;
      code = (typeof res === 'object' && res.code) || 'HTTP_ERROR';
      message = (typeof res === 'object' && res.message) || exception.message;
      details = typeof res === 'object' && res.details ? res.details : undefined;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const payload: ApiStandardResponse = {
      success: false,
      error: {
        code,
        message,
        details,
        correlationId,
      },
      meta: {
        timestamp: new Date().toISOString(),
        correlationId,
      },
    };

    response.status(status).json(payload);
  }
}
