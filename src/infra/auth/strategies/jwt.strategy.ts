import { Injectable, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { IUserRepository } from 'src/@core/domain/user';
import { AuthUserPayload } from 'src/@core/contracts/auth/auth-user-payload.dto';
import { CLIENT_ERROR_CODE, NotFoundError } from 'src/@core/errors/index.error';

type JwtPayload = {
  sub: string;
  email: string;
  iat: number;
  exp: number;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @Inject('IUserRepository')
    private readonly usersRepository: IUserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'default_secret'),
    });
  }

  async validate(payload: JwtPayload): Promise<AuthUserPayload> {
    const user = await this.usersRepository.findById(payload.sub);

    if (!user) {
      throw new NotFoundError(
        'Failed to authenticate user. User not found.',
        CLIENT_ERROR_CODE.USER_NOT_FOUND,
      );
    }

    return { userId: user.id, name: user.name, email: user.email };
  }
}
