import { registerAs } from '@nestjs/config';
import process from 'node:process';

export interface JwtConfigInterface {
  secret: string;
  expiresIn: string;
  refreshSecret: string;
  refreshExpiresIn: string;
}

export const jwtConfigToken = 'JWT_CONFIG_TOKEN';
export const jwtConfig = registerAs(
  jwtConfigToken,
  (): JwtConfigInterface => ({
    secret: process.env.JWT_ACCESS_TOKEN_SECRET,
    expiresIn: process.env.JWT_ACCESS_TOKEN_LIMIT_TIME,
    refreshSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_TOKEN_LIMIT_TIME,
  }),
);
