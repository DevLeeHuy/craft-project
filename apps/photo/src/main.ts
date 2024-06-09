import { NestFactory } from '@nestjs/core';
import { PhotoModule } from './photo.module';

async function bootstrap() {
  const app = await NestFactory.create(PhotoModule);
  await app.listen(3001);
}
bootstrap();
