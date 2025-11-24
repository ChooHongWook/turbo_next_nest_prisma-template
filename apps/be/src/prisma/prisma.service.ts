import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@repo/database/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();

    // Log all queries to the console
    this.$on('query', (e) => {
      console.log('Query:', e.query);
    });
  }
}
