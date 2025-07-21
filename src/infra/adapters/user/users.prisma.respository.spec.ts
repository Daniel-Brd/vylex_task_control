/* eslint-disable @typescript-eslint/unbound-method */
import { Test } from '@nestjs/testing';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { UserMapper } from './user.mapper';
import { User } from 'src/@core/domain/user';
import { UserRepository } from './users.prisma.respository';

jest.mock('./user.mapper');

const mockPrismaService = {
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },
};

describe('UserRepository', () => {
  let repository: UserRepository;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserRepository,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    repository = moduleRef.get<UserRepository>(UserRepository);
    prisma = moduleRef.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should call the mapper and prisma.create with the correct data', async () => {
      const domainUser = { id: 'user-id-123' } as User;
      const persistenceData = { name: 'John Doe', email: 'john@example.com' };
      (UserMapper.toPersistence as jest.Mock).mockReturnValue(persistenceData);

      await repository.create(domainUser);

      expect(UserMapper.toPersistence).toHaveBeenCalledWith(domainUser);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: persistenceData,
      });
    });
  });

  describe('findByEmail', () => {
    it('should return a mapped user when a user is found', async () => {
      const email = 'john.doe@example.com';
      const prismaUser = { id: 'user-id-123', email };
      const domainUser = { id: 'user-id-123' } as User;

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(prismaUser);
      (UserMapper.toDomain as jest.Mock).mockReturnValue(domainUser);

      const result = await repository.findByEmail(email);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email } });
      expect(UserMapper.toDomain).toHaveBeenCalledWith(prismaUser);
      expect(result).toBe(domainUser);
    });

    it('should return null when a user is not found', async () => {
      const email = 'not-found@example.com';
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await repository.findByEmail(email);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email } });
      expect(UserMapper.toDomain).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return a mapped user when a user is found', async () => {
      const id = 'user-id-123';
      const prismaUser = { id, email: 'john.doe@example.com' };
      const domainUser = { id: 'user-id-123' } as User;

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(prismaUser);
      (UserMapper.toDomain as jest.Mock).mockReturnValue(domainUser);

      const result = await repository.findById(id);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id } });
      expect(UserMapper.toDomain).toHaveBeenCalledWith(prismaUser);
      expect(result).toBe(domainUser);
    });

    it('should return null when a user is not found', async () => {
      const id = 'non-existent-id';
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await repository.findById(id);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id } });
      expect(UserMapper.toDomain).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
});
