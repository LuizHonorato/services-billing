import RedisClient from '@/core/infrastructure/cache/redis/redis-client';
import CacheClientOutputPort from '@/core/ports/out/cache-client.output-port';
import { container } from 'tsyringe';

container.registerSingleton<CacheClientOutputPort>(
  'CacheClientOutputPort',
  RedisClient,
);
