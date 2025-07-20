import { Module } from '@nestjs/common';
import { UsersController } from 'src/infra/controllers/users.controller';
import { CreateUserUseCase } from 'src/@core/application/user/use-cases/create-user.use-case';
import { IUserRepository } from 'src/@core/domain/user';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { UserRepository } from 'src/infra/adapters/user/users.prisma.respository';

@Module({
  controllers: [UsersController],
  providers: [
    PrismaService,
    { provide: 'IUserRepository', useClass: UserRepository },
    {
      provide: CreateUserUseCase,
      useFactory: (userRepository: IUserRepository) =>
        new CreateUserUseCase(userRepository),
      inject: ['IUserRepository'],
    },
  ],
})
export class UsersModule {}
