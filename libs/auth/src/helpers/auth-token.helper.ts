import { UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';

export class AuthTokenHelper {
  static decodeToken(service: JwtService, token: string): any {
    if (service instanceof JwtService) {
      return service.decode(token);
    }

    throw new UnprocessableEntityException(
      'No service able to handle the token',
    );
  }
}
