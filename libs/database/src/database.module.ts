import { DynamicModule, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  postgresConfig,
  PostgresConfigInterface,
  postgresConfigToken,
} from '@app/database/config/postgres.config';

interface DatabaseConfig {
  driver: 'postgres';
  dbName: string;
}

@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {
  static forRoot(config: DatabaseConfig): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule.forFeature(postgresConfig)],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            const postgresConfig =
              configService.get<PostgresConfigInterface>(postgresConfigToken);

            return {
              type: config.driver,
              host: postgresConfig.host,
              port: postgresConfig.port,
              username: postgresConfig.username,
              password: postgresConfig.password,
              database: config.dbName,
              autoLoadEntities: true,
            };
          },
        }),
      ],
    };
  }
}
