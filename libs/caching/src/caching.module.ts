import { Module } from '@nestjs/common';
import { CachingService } from './caching.service';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-yet';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  redisConfig,
  RedisConfigInterface,
  redisConfigToken,
} from '@app/caching/config/redis.config';

@Module({
  imports: [
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule.forFeature(redisConfig)],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisConfig: RedisConfigInterface =
          configService.get(redisConfigToken);

        return {
          store: await redisStore({
            ttl: redisConfig.ttl,
            socket: {
              host: redisConfig.host,
              port: redisConfig.port,
            },
          }),
        };
      },
    }),
  ],
  providers: [CachingService],
  exports: [CachingService],
})
export class CachingModule {}
