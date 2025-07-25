import { Module } from '@nestjs/common';
import { UsersController } from 'src/infra/controllers/users.controller';
import { CreateUserUseCase } from 'src/@core/application/user/use-cases/create-user.use-case';
import { IUserRepository } from 'src/@core/domain/user';
import { UserRepository } from 'src/infra/adapters/user/users.prisma.respository';
import { IPasswordHasher } from 'src/@core/domain/auth/password-hasher.port';
import { BcryptHasherService } from 'src/infra/auth/services/bcrypt-hasher.service';

@Module({
  controllers: [UsersController],
  providers: [
    { provide: 'IUserRepository', useClass: UserRepository },
    {
      provide: 'IPasswordHasher',
      useClass: BcryptHasherService,
    },
    {
      provide: CreateUserUseCase,
      useFactory: (userRepository: IUserRepository, hasher: IPasswordHasher) =>
        new CreateUserUseCase(userRepository, hasher),
      inject: ['IUserRepository', 'IPasswordHasher'],
    },
  ],
  exports: ['IUserRepository'],
})
export class UsersModule {}
