import { Injectable } from '@nestjs/common';
import { IUserRepository, User } from 'src/@core/domain/user';
import { UserMapper } from './user.mapper';
import { PrismaService } from 'src/infra/prisma/prisma.service';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async create(user: User): Promise<void> {
    const data = UserMapper.toPersistence(user);

    await this.prisma.user.create({ data });
  }
}
