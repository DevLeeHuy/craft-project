import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from '@app/auth/guards/auth/auth.guard';
import { ContextModule } from '@app/context';
import { CachingModule } from '@app/caching';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  jwtConfig,
  JwtConfigInterface,
  jwtConfigToken,
} from '@app/auth/config/jwt.config';

export const jwtConstants = {
  secret: 'mock_secret',
  refreshSecret: 'mock_refresh_secret',
};

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync({
      imports: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const jwtConfigData =
          configService.get<JwtConfigInterface>(jwtConfigToken);
        return {
          global: true,
          secret: jwtConfigData.secret,
          signOptions: { expiresIn: jwtConfigData.expiresIn },
        };
      },
    }),
    ContextModule,
    CachingModule,
  ],
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
