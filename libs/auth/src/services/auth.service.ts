import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '@app/auth/auth.module';
import { ContextService } from '@app/context';
import { CachingService } from '@app/caching';
import { TokenStatus } from '@app/auth/enums/token-status.enum';
import { Credential } from '@app/auth/interfaces/credential.interface';

export interface UserIdentity {
  id: string;
  username: string;
}

const USER_IDENTITY_CONTEXT_KEY = 'USER_IDENTITY';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private contextService: ContextService,
    private cachingService: CachingService,
  ) {}

  get userIdentity(): UserIdentity {
    return this.contextService.getContext<UserIdentity>(
      USER_IDENTITY_CONTEXT_KEY,
    );
  }

  set userIdentity(identity: UserIdentity) {
    this.contextService.setContext(USER_IDENTITY_CONTEXT_KEY, identity);
  }

  async generateJwtToken(payload: any): Promise<Credential> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: jwtConstants.refreshSecret,
        expiresIn: '30d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async executeRefreshToken(refreshToken: string): Promise<Credential> {
    const payload = await this.jwtService
      .verifyAsync(refreshToken, { secret: jwtConstants.refreshSecret })
      .catch((err) => {
        throw new UnauthorizedException(err);
      });

    delete payload.iat;
    delete payload.exp;

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken,
    };
  }

  async verifyToken(token: string) {
    return this.jwtService.verifyAsync(token);
  }

  async revokeToken(token: string) {
    const { exp } = this.jwtService.decode(token);
    const ttl = exp * 1000 - Date.now();
    if (ttl > 0) {
      return this.cachingService.set(token, TokenStatus.REVOKED, ttl);
    }
  }

  async isRevokedToken(token: string): Promise<boolean> {
    return (
      (await this.cachingService.get<TokenStatus>(token)) ===
      TokenStatus.REVOKED
    );
  }
}
