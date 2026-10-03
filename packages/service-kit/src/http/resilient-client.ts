import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { AppException } from '../errors/app-exception.js';
import { generateInternalToken } from '../auth/internal-token.js';
import { InternalAuthContext } from '@studypal/types';

export enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

export interface ResilientClientOptions {
  baseURL: string;
  serviceName: string;
  timeoutMs?: number;
  maxRetries?: number;
  failureThreshold?: number;
  resetTimeoutMs?: number;
  internalSecret?: string;
}

export class ResilientHttpClient {
  private client: AxiosInstance;
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount = 0;
  private nextAttempt = 0;
  private readonly options: Required<ResilientClientOptions>;

  constructor(options: ResilientClientOptions) {
    this.options = {
      baseURL: options.baseURL,
      serviceName: options.serviceName,
      timeoutMs: options.timeoutMs ?? 5000,
      maxRetries: options.maxRetries ?? 3,
      failureThreshold: options.failureThreshold ?? 5,
      resetTimeoutMs: options.resetTimeoutMs ?? 15000,
      internalSecret:
        options.internalSecret ||
        process.env.INTERNAL_SERVICE_SECRET ||
        'studypal_dev_internal_service_hmac_secret_32bytes_min',
    };

    this.client = axios.create({
      baseURL: this.options.baseURL,
      timeout: this.options.timeoutMs,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  private checkCircuit() {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() > this.nextAttempt) {
        this.state = CircuitState.HALF_OPEN;
      } else {
        throw AppException.circuitBreakerOpen(this.options.serviceName);
      }
    }
  }

  private recordSuccess() {
    this.failureCount = 0;
    this.state = CircuitState.CLOSED;
  }

  private recordFailure() {
    this.failureCount++;
    if (this.failureCount >= this.options.failureThreshold || this.state === CircuitState.HALF_OPEN) {
      this.state = CircuitState.OPEN;
      this.nextAttempt = Date.now() + this.options.resetTimeoutMs;
    }
  }

  async request<T = any>(
    config: AxiosRequestConfig,
    authContext?: Omit<InternalAuthContext, 'timestamp'>,
  ): Promise<T> {
    this.checkCircuit();

    const headers: Record<string, string> = {
      ...(config.headers as any),
    };

    if (authContext) {
      const token = generateInternalToken(authContext, this.options.internalSecret);
      headers['x-internal-auth'] = token;
      headers['x-correlation-id'] = authContext.correlationId;
    }

    let attempt = 0;
    while (attempt < this.options.maxRetries) {
      try {
        attempt++;
        const response = await this.client.request<T>({
          ...config,
          headers,
        });
        this.recordSuccess();
        return response.data;
      } catch (err: any) {
        // If HTTP 4xx, it's not a circuit-breaker failure (it's user/client error)
        if (err.response && err.response.status >= 400 && err.response.status < 500) {
          throw err;
        }

        if (attempt >= this.options.maxRetries) {
          this.recordFailure();
          throw err;
        }

        // Retry with exponential backoff + jitter
        const backoff = Math.pow(2, attempt) * 150 + Math.random() * 100;
        await new Promise((resolve) => setTimeout(resolve, backoff));
      }
    }

    throw new Error(`Failed to execute request to ${this.options.serviceName} after max retries`);
  }

  async get<T = any>(url: string, authContext?: Omit<InternalAuthContext, 'timestamp'>): Promise<T> {
    return this.request<T>({ method: 'GET', url }, authContext);
  }

  async post<T = any>(
    url: string,
    data?: any,
    authContext?: Omit<InternalAuthContext, 'timestamp'>,
  ): Promise<T> {
    return this.request<T>({ method: 'POST', url, data }, authContext);
  }

  async put<T = any>(
    url: string,
    data?: any,
    authContext?: Omit<InternalAuthContext, 'timestamp'>,
  ): Promise<T> {
    return this.request<T>({ method: 'PUT', url, data }, authContext);
  }

  async delete<T = any>(
    url: string,
    authContext?: Omit<InternalAuthContext, 'timestamp'>,
  ): Promise<T> {
    return this.request<T>({ method: 'DELETE', url }, authContext);
  }
}
