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

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user ? UserMapper.toDomain(user) : null;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user ? UserMapper.toDomain(user) : null;
  }
}
