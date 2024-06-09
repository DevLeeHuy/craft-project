import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '@app/database';
import { User } from './entities/user.entity';
import { AuthModule } from '@app/auth';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    DatabaseModule.forRoot({ dbName: 'user', driver: 'postgres' }),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
