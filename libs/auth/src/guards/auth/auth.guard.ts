import {
  CanActivate,
  ExecutionContext,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TokenExpiredError } from '@nestjs/jwt';
import { AuthExtractionHelper } from '@app/auth/helpers/auth-extraction.helper';
import { AuthService } from '@app/auth';

@Injectable()
export class AuthGuard implements CanActivate {
  @Inject(forwardRef(() => AuthService))
  private authService: AuthService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return this.isValid(context);
  }

  private async isValid(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = AuthExtractionHelper.extractFromRequest(request);

    if (await this.authService.isRevokedToken(token)) {
      throw new UnauthorizedException('Token was revoked');
    }

    try {
      const userInfo = await this.authService.verifyToken(token);

      return !!userInfo;
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token is expired');
      }

      return false;
    }
  }
}
