import { Module } from '@nestjs/common';
import { PhotoController } from './photo.controller';
import { PhotoService } from './photo.service';
import { DatabaseModule } from '@app/database';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Photo } from './entities/photo.entity';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@app/auth/guards/auth/auth.guard';
import { AuthModule } from '@app/auth';

@Module({
  imports: [
    TypeOrmModule.forFeature([Photo]),
    DatabaseModule.forRoot({ dbName: 'photo' }),
    HttpModule,
    AuthModule,
  ],
  controllers: [PhotoController],
  providers: [{ provide: APP_GUARD, useClass: AuthGuard }, PhotoService],
})
export class PhotoModule {}
