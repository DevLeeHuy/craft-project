import { registerAs } from '@nestjs/config';
import { LoggerOptions } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const postgresConfigToken = 'postgres.config';

export type PostgresConfigInterface = {
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database?: string;
  migrationDir?: string;
  migrationsTableName?: string;

  /**
   * Enabled logging for ORM. Be careful if enable this one on **PRODUCTION**.
   */
  logging?: LoggerOptions;
  autoMigration?: boolean;
  ssl?: any;
  connectionPoolSize?: number;
  referenceRetrieveConnectionPoolSize?: number;
} & Pick<PostgresConnectionOptions, 'migrations'>;

export const postgresConfig = registerAs(
  postgresConfigToken,
  (): PostgresConfigInterface => ({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    migrationDir: process.env.MIGRATION_DIR,
    logging:
      process.env.DB_LOGGING === 'true'
        ? true
        : (process.env.DB_LOGGING as LoggerOptions),
    ssl:
      process.env.DB_SSLMODE === 'require'
        ? {
            rejectUnauthorized: false,
          }
        : false,
    autoMigration: Boolean(process.env.AUTO_MIGRATION === 'true'),
    referenceRetrieveConnectionPoolSize: Number(
      process.env.DB_REFERENCE_RETRIEVE_CONNECTION_POOL_SIZE,
    )
      ? Number(process.env.DB_REFERENCE_RETRIEVE_CONNECTION_POOL_SIZE)
      : 2,
    connectionPoolSize: Number(process.env.DB_CONNECTION_POOL_SIZE)
      ? Number(process.env.DB_CONNECTION_POOL_SIZE)
      : 10,
  }),
);
