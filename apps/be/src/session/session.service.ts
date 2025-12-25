import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SessionService implements OnModuleDestroy {
  private redisClient: RedisClientType;

  constructor(private configService: ConfigService) {
    this.redisClient = createClient({
      socket: {
        host: this.configService.get<string>('REDIS_HOST', 'localhost'),
        port: this.configService.get<number>('REDIS_PORT', 6379),
      },
    });

    this.redisClient.on('error', (err) =>
      console.error('Redis Client Error', err),
    );

    this.connect();
  }

  private async connect() {
    if (!this.redisClient.isOpen) {
      await this.redisClient.connect();
      console.log('✅ Redis connected successfully');
    }
  }

  async onModuleDestroy() {
    if (this.redisClient.isOpen) {
      await this.redisClient.quit();
      console.log('Redis connection closed');
    }
  }

  getClient(): RedisClientType {
    return this.redisClient;
  }

  // 세션 데이터 저장
  async setSession(
    sessionId: string,
    data: Record<string, unknown>,
    ttl?: number,
  ): Promise<void> {
    const key = `sess:${sessionId}`;
    const value = JSON.stringify(data);

    if (ttl) {
      await this.redisClient.setEx(key, ttl, value);
    } else {
      await this.redisClient.set(key, value);
    }
  }

  // 세션 데이터 조회
  async getSession<T = Record<string, unknown>>(
    sessionId: string,
  ): Promise<T | null> {
    const key = `sess:${sessionId}`;
    const data = await this.redisClient.get(key);

    if (!data) return null;

    try {
      return JSON.parse(String(data)) as T;
    } catch {
      return null;
    }
  }

  // 세션 삭제
  async deleteSession(sessionId: string): Promise<void> {
    const key = `sess:${sessionId}`;
    await this.redisClient.del(key);
  }

  // 세션 존재 여부 확인
  async hasSession(sessionId: string): Promise<boolean> {
    const key = `sess:${sessionId}`;
    const exists = await this.redisClient.exists(key);
    return exists === 1;
  }

  // 세션 TTL 갱신
  async refreshSession(sessionId: string, ttl: number): Promise<void> {
    const key = `sess:${sessionId}`;
    await this.redisClient.expire(key, ttl);
  }
}
