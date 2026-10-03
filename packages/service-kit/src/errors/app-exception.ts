import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '@studypal/types';

export class AppException extends HttpException {
  public readonly code: ErrorCode;
  public readonly details?: any;

  constructor(code: ErrorCode, message: string, status: HttpStatus = HttpStatus.BAD_REQUEST, details?: any) {
    super({ code, message, details }, status);
    this.code = code;
    this.details = details;
  }

  static badRequest(message: string, details?: any): AppException {
    return new AppException('BAD_REQUEST', message, HttpStatus.BAD_REQUEST, details);
  }

  static validationFailed(message: string, details?: any): AppException {
    return new AppException('VALIDATION_FAILED', message, HttpStatus.UNPROCESSABLE_ENTITY, details);
  }

  static unauthorized(message = 'Unauthorized access'): AppException {
    return new AppException('UNAUTHORIZED', message, HttpStatus.UNAUTHORIZED);
  }

  static forbidden(message = 'Access forbidden'): AppException {
    return new AppException('FORBIDDEN', message, HttpStatus.FORBIDDEN);
  }

  static notFound(message = 'Resource not found'): AppException {
    return new AppException('NOT_FOUND', message, HttpStatus.NOT_FOUND);
  }

  static conflict(message: string): AppException {
    return new AppException('CONFLICT', message, HttpStatus.CONFLICT);
  }

  static rateLimited(message = 'Rate limit exceeded, please retry later'): AppException {
    return new AppException('RATE_LIMIT_EXCEEDED', message, HttpStatus.TOO_MANY_REQUESTS);
  }

  static internal(message = 'Internal server error', details?: any): AppException {
    return new AppException('INTERNAL_SERVER_ERROR', message, HttpStatus.INTERNAL_SERVER_ERROR, details);
  }

  static circuitBreakerOpen(serviceName: string): AppException {
    return new AppException(
      'CIRCUIT_BREAKER_OPEN',
      `Service ${serviceName} is currently unavailable (circuit open)`,
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }
}
