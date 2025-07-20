import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthenticateUserUseCase } from 'src/@core/application/auth/usecases/auth-user.use-case';
import { AuthController } from 'src/infra/controllers/auth.controller';
import { UsersModule } from './users.module';
import { JwtStrategy } from 'src/infra/auth/strategies/jwt.strategy';
import { BcryptHasherService } from 'src/infra/auth/services/bcrypt-hasher.service';
import { JwtTokenService } from 'src/infra/auth/services/jwt-token.service';
import { IUserRepository } from 'src/@core/domain/user';
import { IAuthTokenGenerator } from 'src/@core/domain/auth/auth-token.port';
import { IPasswordHasher } from 'src/@core/domain/auth/password-hasher.port';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'default_secret'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION', '1h'),
        },
      }),
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    {
      provide: 'IPasswordHasher',
      useClass: BcryptHasherService,
    },
    {
      provide: 'IAuthTokenGenerator',
      useClass: JwtTokenService,
    },
    {
      provide: AuthenticateUserUseCase,
      useFactory: (
        userRepository: IUserRepository,
        passwordHasher: IPasswordHasher,
        tokenGenerator: IAuthTokenGenerator,
      ) =>
        new AuthenticateUserUseCase(
          userRepository,
          passwordHasher,
          tokenGenerator,
        ),
      inject: ['IUserRepository', 'IPasswordHasher', 'IAuthTokenGenerator'],
    },
  ],
})
export class AuthModule {}
