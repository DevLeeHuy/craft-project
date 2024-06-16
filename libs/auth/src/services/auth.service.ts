import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ContextService } from '@app/context';
import { CachingService } from '@app/caching';
import { TokenStatus } from '@app/auth/enums/token-status.enum';
import { Credential } from '@app/auth/interfaces/credential.interface';
import { ConfigService } from '@nestjs/config';
import {
  JwtConfigInterface,
  jwtConfigToken,
} from '@app/auth/config/jwt.config';

export interface UserIdentity {
  id: string;
  username: string;
}

const USER_IDENTITY_CONTEXT_KEY = 'USER_IDENTITY';

@Injectable()
export class AuthService {
  private readonly jwtConfig: JwtConfigInterface;
  constructor(
    private jwtService: JwtService,
    private contextService: ContextService,
    private cachingService: CachingService,
    private configService: ConfigService,
  ) {
    this.jwtConfig = this.configService.get<JwtConfigInterface>(jwtConfigToken);
  }

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
        secret: this.jwtConfig.refreshSecret,
        expiresIn: this.jwtConfig.refreshExpiresIn,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async executeRefreshToken(refreshToken: string): Promise<Credential> {
    const payload = await this.jwtService
      .verifyAsync(refreshToken, { secret: this.jwtConfig.refreshSecret })
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
    const { exp, jti } = this.jwtService.decode(token);

    // Set ttl equal to expired time of the token
    const ttl = exp * 1000 - Date.now();
    if (ttl > 0) {
      return this.cachingService.set(jti, TokenStatus.REVOKED, ttl);
    }
  }

  async isRevokedToken(token: string): Promise<boolean> {
    const { jti } = this.jwtService.decode(token);
    return (
      (await this.cachingService.get<TokenStatus>(jti)) === TokenStatus.REVOKED
    );
  }
}
