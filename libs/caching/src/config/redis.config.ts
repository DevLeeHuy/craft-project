import { registerAs } from '@nestjs/config';

export interface RedisConfigInterface {
  host: string;
  port: number;
  ttl?: number;
}

export const redisConfigToken = 'redis.config';
export const redisConfig = registerAs(
  redisConfigToken,
  (): RedisConfigInterface => ({
    host: 'redis',
    port: 6379,
    ttl: 60 * 60,
  }),
);
