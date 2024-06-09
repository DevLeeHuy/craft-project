import {
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';

export class AuthExtractionHelper {
  static extractFromRequest(request: any) {
    const { authorization } = request.headers;

    return this.extractTokenFromAuthorization(authorization);
  }

  private static extractTokenFromAuthorization(token: string): string {
    if (!token) {
      throw new UnauthorizedException('Missing access token!');
    }

    if (token.startsWith('Bearer')) {
      return token.substring('Bearer '.length);
    }

    return token;
  }

  static getPayloadFromToken(service: JwtService, token: string): any {
    if (service instanceof JwtService) {
      return service.decode(token);
    }

    throw new UnprocessableEntityException(
      'No service able to handle the token',
    );
  }
}
