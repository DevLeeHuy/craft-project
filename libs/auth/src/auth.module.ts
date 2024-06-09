import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from '@app/auth/guards/auth/auth.guard';
import { ContextModule } from '@app/context';
import { CachingModule } from '@app/caching';

export const jwtConstants = {
  secret: 'mock_secret',
  refreshSecret: 'mock_refresh_secret',
};

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60m' },
    }),
    ContextModule,
    CachingModule,
  ],
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
