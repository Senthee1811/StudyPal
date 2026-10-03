import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../prisma/generated/client/index.js';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect();
    } catch (err: any) {
      console.warn(`[PrismaService:assessment] Connection deferred: ${err.message}`);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
