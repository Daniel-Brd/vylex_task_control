import { TaskOutputDto } from './task-output.dto';
import { Task, TaskStatus } from 'src/@core/domain/task';

describe('TaskOutputDto', () => {
  describe('fromEntity', () => {
    it('should correctly map a completed Task entity to a TaskOutputDto', () => {
      const mockTaskEntity = {
        id: 'task-id-123',
        userId: 'user-id-123',
        title: 'Test DTO Mapping',
        description: 'Ensure all properties are mapped correctly.',
        status: TaskStatus.COMPLETED,
        dueDate: new Date('2025-08-01T23:59:59.000Z'),
        createdAt: new Date('2025-07-20T12:00:00.000Z'),
        completedAt: new Date('2025-07-25T10:30:00.000Z'),
      } as Task;

      const expectedDto = {
        id: mockTaskEntity.id,
        title: mockTaskEntity.title,
        description: mockTaskEntity.description,
        status: mockTaskEntity.status,
        dueDate: mockTaskEntity.dueDate,
        createdAt: mockTaskEntity.createdAt,
        completedAt: mockTaskEntity.completedAt,
      };

      const result = TaskOutputDto.fromEntity(mockTaskEntity);

      expect(result).toBeInstanceOf(TaskOutputDto);
      expect(result).toEqual(expectedDto);
    });

    it('should correctly map a pending Task entity with a null completedAt date', () => {
      const mockTaskEntity = {
        id: 'task-id-456',
        userId: 'user-id-123',
        title: 'Pending Task Test',
        description: 'This task should have a null completedAt.',
        status: TaskStatus.PENDING,
        dueDate: new Date('2025-09-15T12:00:00.000Z'),
        createdAt: new Date('2025-07-20T12:00:00.000Z'),
        completedAt: null,
      } as Task;

      const result = TaskOutputDto.fromEntity(mockTaskEntity);

      expect(result).toBeInstanceOf(TaskOutputDto);
      expect(result.completedAt).toBeNull();
      expect(result.status).toBe(TaskStatus.PENDING);
    });

    it('should have properties that exactly match the source entity', () => {
      const mockTaskEntity = {
        id: 'task-id-exact-match',
        userId: 'user-id-123',
        title: 'Exact Match Test Title',
        description: 'A specific description for exact matching.',
        status: TaskStatus.IN_PROGRESS,
        dueDate: new Date('2025-08-01T23:59:59.000Z'),
        createdAt: new Date('2025-07-20T12:00:00.000Z'),
        completedAt: null,
      } as Task;

      const result = TaskOutputDto.fromEntity(mockTaskEntity);

      expect(result.id).toBe(mockTaskEntity.id);
      expect(result.title).toBe(mockTaskEntity.title);
      expect(result.description).toBe(mockTaskEntity.description);
      expect(result.status).toBe(mockTaskEntity.status);
      expect(result.dueDate).toBe(mockTaskEntity.dueDate);
      expect(result.createdAt).toBe(mockTaskEntity.createdAt);
      expect(result.completedAt).toBe(mockTaskEntity.completedAt);
    });

    it('should not include properties from the entity that are not defined in the DTO', () => {
      const mockTaskEntity = {
        id: 'task-id-123',
        userId: 'user-id-to-be-excluded',
        title: 'Test Property Exclusion',
        description: 'Ensure userId is not exposed.',
        status: TaskStatus.PENDING,
        dueDate: new Date('2025-08-01T23:59:59.000Z'),
        createdAt: new Date('2025-07-20T12:00:00.000Z'),
        completedAt: null,
      } as Task;

      const result = TaskOutputDto.fromEntity(mockTaskEntity);

      expect(result).toHaveProperty('id');
      expect(result).not.toHaveProperty('userId');
    });
  });
});
