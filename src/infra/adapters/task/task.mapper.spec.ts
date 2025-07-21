import { TaskMapper } from './task.mapper';
import { Task, TaskStatus } from 'src/@core/domain/task';
import { Task as PrismaTask } from '@prisma/client';

jest.mock('src/@core/domain/task/task.entity');

describe('TaskMapper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('toPersistence', () => {
    it('should correctly map a domain Task to a PrismaTask object', () => {
      const domainTask = {
        id: 'task-id-123',
        userId: 'user-id-123',
        title: 'Refactor services layer',
        description: 'Apply dependency inversion to all services.',
        status: TaskStatus.IN_PROGRESS,
        dueDate: new Date('2025-08-01T23:59:59.000Z'),
        createdAt: new Date('2025-07-20T12:00:00.000Z'),
        completedAt: null,
      } as Task;

      const expectedPrismaTask: PrismaTask = {
        id: 'task-id-123',
        userId: 'user-id-123',
        title: 'Refactor services layer',
        description: 'Apply dependency inversion to all services.',
        status: 'IN_PROGRESS',
        dueDate: new Date('2025-08-01T23:59:59.000Z'),
        createdAt: new Date('2025-07-20T12:00:00.000Z'),
        completedAt: null,
      };

      const result = TaskMapper.toPersistence(domainTask);

      expect(result).toEqual(expectedPrismaTask);
    });
  });

  describe('toDomain', () => {
    it('should call Task.reconstitute with prisma data and return its result', () => {
      const prismaTask: PrismaTask = {
        id: 'task-id-456',
        userId: 'user-id-123',
        title: 'Deploy to staging environment',
        description: 'Run all deployment scripts for staging.',
        status: 'COMPLETED',
        dueDate: new Date('2025-07-19T23:59:59.000Z'),
        createdAt: new Date('2025-07-10T10:00:00.000Z'),
        completedAt: new Date('2025-07-18T16:00:00.000Z'),
      };

      const mockDomainTask = { id: 'task-id-456' } as Task;

      const reconstituteSpy = jest
        .spyOn(Task, 'reconstitute')
        .mockReturnValue(mockDomainTask);

      const result = TaskMapper.toDomain(prismaTask);

      expect(reconstituteSpy).toHaveBeenCalledTimes(1);
      expect(reconstituteSpy).toHaveBeenCalledWith({
        id: prismaTask.id,
        userId: prismaTask.userId,
        title: prismaTask.title,
        description: prismaTask.description,
        status: 'COMPLETED',
        dueDate: prismaTask.dueDate,
        createdAt: prismaTask.createdAt,
        completedAt: prismaTask.completedAt,
      });
      expect(result).toBe(mockDomainTask);
    });
  });
});
