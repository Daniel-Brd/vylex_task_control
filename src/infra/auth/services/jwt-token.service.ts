import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  AuthTokenPayload,
  IAuthTokenGenerator,
} from 'src/@core/domain/auth/auth-token.port';
@Injectable()
export class JwtTokenService implements IAuthTokenGenerator {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generate(payload: AuthTokenPayload): Promise<string> {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET', 'default_secret'),
      expiresIn: this.configService.get<string>('JWT_EXPIRATION', '1h'),
    });
    return accessToken;
  }
}
