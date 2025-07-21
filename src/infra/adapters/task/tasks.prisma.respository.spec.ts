/* eslint-disable @typescript-eslint/unbound-method */
import { Test } from '@nestjs/testing';
import { TaskRepository } from './tasks.prisma.respository';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { TaskMapper } from './task.mapper';
import { Task, TaskStatus } from 'src/@core/domain/task';
import { Prisma } from '@prisma/client';
import { TaskFilters } from 'src/@core/domain/task/task-filters.type';
import {
  NullsOrder,
  SortBy,
  SortOrder,
  TaskOrderBy,
} from 'src/@core/domain/task/task-order.type';

jest.mock('./task.mapper');
const mockPrismaService = {
  task: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
};

class TestableTaskRepository extends TaskRepository {
  public createWhereConditions(filters: TaskFilters): Prisma.TaskWhereInput {
    return super.createWhereConditions(filters);
  }

  public createOrderBy(
    orderBy: TaskOrderBy | undefined,
  ): Prisma.TaskOrderByWithRelationInput {
    return super.createOrderBy(orderBy);
  }
}

describe('TaskRepository', () => {
  let repository: TestableTaskRepository;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: TaskRepository,
          useClass: TestableTaskRepository,
        },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    repository = moduleRef.get<TestableTaskRepository>(TaskRepository);
    prisma = moduleRef.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('createWhereConditions', () => {
    it('should create where conditions for userId and status', () => {
      const filters = { userId: 'user-id-123', status: TaskStatus.PENDING };

      const where = repository.createWhereConditions(filters);
      expect(where).toEqual({
        userId: 'user-id-123',
        status: 'PENDING',
      });
    });

    it('should create where conditions for only userId', () => {
      const filters = { userId: 'user-id-123' };
      const where = repository.createWhereConditions(filters);
      expect(where).toEqual({ userId: 'user-id-123' });
    });
  });

  describe('createOrderBy', () => {
    it('should return default order by createdAt descending if no params are given', () => {
      const orderBy = repository.createOrderBy(undefined);
      expect(orderBy).toEqual({ createdAt: 'desc' });
    });

    it('should create order by for a non-nullable column', () => {
      const params = {
        sortBy: SortBy.DUE_DATE,
        sortOrder: SortOrder.ASC,
      };
      const orderBy = repository.createOrderBy(params);
      expect(orderBy).toEqual({ dueDate: 'asc' });
    });

    it('should create order by for a nullable column with explicit nulls handling', () => {
      const params = {
        sortBy: SortBy.COMPLETED_AT,
        sortOrder: SortOrder.ASC,
        nulls: NullsOrder.FIRST,
      };
      const orderBy = repository.createOrderBy(params);
      expect(orderBy).toEqual({
        completedAt: { sort: 'asc', nulls: 'first' },
      });
    });
  });

  describe('findAllByUserId', () => {
    it('should call prisma.findMany with correct where and orderBy clauses', async () => {
      const userId = 'user-id-123';
      const mockPrismaTask = { id: 'task-id-123', title: 'Test Task', userId };
      (prisma.task.findMany as jest.Mock).mockResolvedValue([mockPrismaTask]);
      (TaskMapper.toDomain as jest.Mock).mockReturnValue({});

      await repository.findAllByUserId(userId);

      expect(prisma.task.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-id-123' },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('create', () => {
    it('should call prisma.create with data from mapper', async () => {
      const taskInstance = Task.create({
        userId: 'user-id-123',
        title: 'Finalize project tests',
        description: 'Implement unit and e2e tests for the new feature.',
        dueDate: new Date('2025-08-01T23:59:59.000Z'),
      });

      const mockPersistenceData = {
        id: 'task-id-123',
        userId: 'user-id-123',
        title: 'Finalize project tests',
        status: 'PENDING',
      };
      (TaskMapper.toPersistence as jest.Mock).mockReturnValue(
        mockPersistenceData,
      );

      await repository.create(taskInstance);

      expect(TaskMapper.toPersistence).toHaveBeenCalledWith(taskInstance);

      expect(prisma.task.create).toHaveBeenCalledWith({
        data: mockPersistenceData,
      });
    });
  });
});
