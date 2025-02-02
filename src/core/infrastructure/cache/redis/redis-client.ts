import CacheClientOutputPort from '@/core/ports/out/cache-client.output-port';
import Redis from 'ioredis';

export default class RedisClient implements CacheClientOutputPort {
  private readonly instance: Redis;

  constructor() {
    this.instance = new Redis({
      host: process.env.CACHE_HOST,
      port: Number(process.env.CACHE_PORT),
      password: process.env.CACHE_PASSWORD,
    });
  }

  async get<T>(key: string): Promise<T> {
    const value = await this.instance.get(key);

    if (!value) {
      return null;
    }

    return JSON.parse(value) as T;
  }

  async set(key: string, value: string): Promise<void> {
    await this.instance.set(key, value);
  }

  async delete(key: string): Promise<void> {
    await this.instance.del(key);
  }
}
