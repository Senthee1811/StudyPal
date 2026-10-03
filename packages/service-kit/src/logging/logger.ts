import { Injectable, LoggerService, Scope } from '@nestjs/common';

export interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  service: string;
  message: string;
  correlationId?: string;
  context?: string;
  meta?: Record<string, any>;
  stack?: string;
}

@Injectable({ scope: Scope.DEFAULT })
export class JsonLogger implements LoggerService {
  private serviceName: string;

  constructor(serviceName?: string) {
    this.serviceName = serviceName || process.env.SERVICE_NAME || 'studypal-service';
  }

  setService(name: string) {
    this.serviceName = name;
  }

  private writeLog(level: LogEntry['level'], message: any, context?: string, meta?: any) {
    let msgString = typeof message === 'string' ? message : JSON.stringify(message);
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      service: this.serviceName,
      message: msgString,
      context,
      meta: typeof meta === 'object' ? meta : undefined,
    };

    if (level === 'error') {
      console.error(JSON.stringify(entry));
    } else if (level === 'warn') {
      console.warn(JSON.stringify(entry));
    } else {
      console.log(JSON.stringify(entry));
    }
  }

  log(message: any, context?: string) {
    this.writeLog('info', message, context);
  }

  error(message: any, trace?: string, context?: string) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'error',
      service: this.serviceName,
      message: typeof message === 'string' ? message : JSON.stringify(message),
      context,
      stack: trace,
    };
    console.error(JSON.stringify(entry));
  }

  warn(message: any, context?: string) {
    this.writeLog('warn', message, context);
  }

  debug(message: any, context?: string) {
    if (process.env.LOG_LEVEL === 'debug' || process.env.LOG_LEVEL === 'trace') {
      this.writeLog('debug', message, context);
    }
  }
}
