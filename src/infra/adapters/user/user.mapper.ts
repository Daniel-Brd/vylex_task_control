import { User as PrismaUser } from '@prisma/client';
import { User } from 'src/@core/domain/user';

export class UserMapper {
  public static toPersistence(domainUser: User): PrismaUser {
    const data: PrismaUser = {
      id: domainUser.id,
      name: domainUser.name,
      email: domainUser.email,
      password: domainUser.password,
      createdAt: domainUser.createdAt,
      updatedAt: domainUser.updatedAt,
    };

    return data;
  }
}
