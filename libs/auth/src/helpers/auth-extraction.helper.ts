import { UnauthorizedException } from '@nestjs/common';

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
}
