import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { Public } from '../auth/guards.js';

export interface ReadinessChecker {
  name: string;
  check: () => Promise<boolean>;
}

@Controller()
export class HealthController {
  private static readinessCheckers: ReadinessChecker[] = [];

  static registerReadinessChecker(checker: ReadinessChecker) {
    HealthController.readinessCheckers.push(checker);
  }

  @Public()
  @Get('health/live')
  live() {
    return {
      status: 'UP',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  @Public()
  @Get('health/ready')
  async ready(@Res() res: Response) {
    const checks: Record<string, boolean> = {};
    let allReady = true;

    for (const checker of HealthController.readinessCheckers) {
      try {
        const ok = await checker.check();
        checks[checker.name] = ok;
        if (!ok) allReady = false;
      } catch (_) {
        checks[checker.name] = false;
        allReady = false;
      }
    }

    const statusCode = allReady ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE;
    return res.status(statusCode).json({
      status: allReady ? 'READY' : 'NOT_READY',
      timestamp: new Date().toISOString(),
      checks,
    });
  }

  @Public()
  @Get('metrics')
  metrics(@Res() res: Response) {
    const memory = process.memoryUsage();
    const prometheusMetrics = [
      '# HELP process_uptime_seconds The uptime of the process in seconds.',
      '# TYPE process_uptime_seconds gauge',
      `process_uptime_seconds ${process.uptime()}`,
      '# HELP process_heap_bytes Process heap memory usage in bytes.',
      '# TYPE process_heap_bytes gauge',
      `process_heap_bytes ${memory.heapUsed}`,
      '# HELP process_rss_bytes Process resident set size in bytes.',
      '# TYPE process_rss_bytes gauge',
      `process_rss_bytes ${memory.rss}`,
    ].join('\n');

    res.setHeader('Content-Type', 'text/plain; version=0.0.4');
    return res.send(prometheusMetrics);
  }
}
