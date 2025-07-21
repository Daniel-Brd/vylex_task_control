import { UserMapper } from './user.mapper';
import { User } from 'src/@core/domain/user';
import { User as PrismaUser } from '@prisma/client';

jest.mock('src/@core/domain/user/user.entity');

describe('UserMapper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('toPersistence', () => {
    it('should correctly map a domain User to a PrismaUser object', () => {
      const domainUser: User = {
        id: 'user-id-123',
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'hashed_password',
        createdAt: new Date('2025-07-20T12:00:00.000Z'),
        updatedAt: new Date('2025-07-21T10:00:00.000Z'),
      };

      const expectedPrismaUser: PrismaUser = {
        id: 'user-id-123',
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'hashed_password',
        createdAt: new Date('2025-07-20T12:00:00.000Z'),
        updatedAt: new Date('2025-07-21T10:00:00.000Z'),
      };

      const result = UserMapper.toPersistence(domainUser);

      expect(result).toEqual(expectedPrismaUser);
    });
  });

  describe('toDomain', () => {
    it('should call User.reconstitute with prisma data and return the result', () => {
      const prismaUser: PrismaUser = {
        id: 'user-id-456',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        password: 'another_hashed_password',
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
        updatedAt: new Date('2025-02-02T00:00:00.000Z'),
      };

      const mockDomainUser: User = {
        id: 'user-id-456',
        name: 'John Doe D',
        email: 'john.doe.D@example.com',
        password: 'hashed_password',
        createdAt: new Date('2025-07-20T12:00:00.000Z'),
        updatedAt: new Date('2025-07-21T10:00:00.000Z'),
      };

      const reconstituteSpy = jest
        .spyOn(User, 'reconstitute')
        .mockReturnValue(mockDomainUser);

      const result = UserMapper.toDomain(prismaUser);

      expect(reconstituteSpy).toHaveBeenCalledTimes(1);
      expect(reconstituteSpy).toHaveBeenCalledWith(prismaUser);
      expect(result).toBe(mockDomainUser);
    });
  });
});
