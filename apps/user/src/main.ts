import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import * as dotenv from 'dotenv-flow';
import * as process from 'node:process';

async function bootstrap() {
  dotenv.config({ path: './apps/user' });
  const app = await NestFactory.create(UserModule);
  await app.listen(process.env.APP_PORT);
}
bootstrap();
