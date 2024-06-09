import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '@app/auth';
import { AuthExtractionHelper } from '@app/auth/helpers/auth-extraction.helper';
import { AuthTokenHelper } from '@app/auth/helpers/auth-token.helper';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    this.handleUserIdentity(request);

    return next.handle();
  }

  private handleUserIdentity(request: any) {
    const payload = AuthTokenHelper.decodeToken(
      this.jwtService,
      AuthExtractionHelper.extractFromRequest(request),
    );

    this.authService.userIdentity = {
      id: payload.sub,
      username: payload.username,
    };
  }
}
