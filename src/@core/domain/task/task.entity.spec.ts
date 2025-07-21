import { randomUUID } from 'crypto';
import { Task, TaskProps, TaskStatus } from './task.entity';
import type * as Crypto from 'crypto';
import {
  CLIENT_ERROR_CODE,
  DomainRuleError,
} from 'src/@core/errors/index.error';

jest.mock('crypto', (): typeof Crypto => ({
  ...jest.requireActual('crypto'),
  randomUUID: jest.fn(),
}));

describe('Task Entity', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createBaseTask = (initialProps?: Partial<TaskProps>): Task => {
    const defaultProps: TaskProps = {
      id: 'task-id-123',
      userId: 'user-id-123',
      title: 'Initial Title',
      description: 'Initial Description',
      status: TaskStatus.PENDING,
      dueDate: new Date('2025-08-01T23:59:59.000Z'),
      createdAt: new Date('2025-07-20T12:00:00.000Z'),
      completedAt: null,
    };
    return Task.reconstitute({ ...defaultProps, ...initialProps });
  };

  describe('create', () => {
    it('should create a new task with default pending status and generated properties', () => {
      const fixedUUID = 'task-id-123';
      const fixedCreationDate = new Date('2025-07-20T12:00:00.000Z');
      const dueDate = new Date('2025-08-01T23:59:59.000Z');

      (randomUUID as jest.Mock).mockReturnValue(fixedUUID);
      jest.useFakeTimers().setSystemTime(fixedCreationDate);

      const createProps = {
        userId: 'user-id-123',
        title: 'Complete the project proposal',
        description: 'Write the final draft and send it for review.',
        dueDate: dueDate,
      };

      const task = Task.create(createProps);

      expect(task).toBeInstanceOf(Task);
      expect(task.id).toBe(fixedUUID);
      expect(task.status).toBe(TaskStatus.PENDING);
      expect(task.createdAt).toEqual(fixedCreationDate);
      expect(task.completedAt).toBeNull();

      jest.useRealTimers();
    });
  });

  describe('reconstitute', () => {
    it('should create a task instance from existing data', () => {
      const taskProps: TaskProps = {
        id: 'existing-task-id-123',
        userId: 'user-id-123',
        title: 'Existing Task',
        description: 'An existing description',
        status: TaskStatus.COMPLETED,
        dueDate: new Date('2025-08-01T23:59:59.000Z'),
        createdAt: new Date('2025-07-20T12:00:00.000Z'),
        completedAt: new Date('2025-07-21T10:00:00.000Z'),
      };

      const task = Task.reconstitute(taskProps);

      expect(task).toBeInstanceOf(Task);
      expect(task).toEqual(taskProps);
    });
  });

  describe('startProgress', () => {
    it('should change status to IN_PROGRESS if task is PENDING', () => {
      const task = createBaseTask({ status: TaskStatus.PENDING });
      task.startProgress();
      expect(task.status).toBe(TaskStatus.IN_PROGRESS);
    });

    it('should throw DomainRuleError if task is already IN_PROGRESS', () => {
      const task = createBaseTask({ status: TaskStatus.IN_PROGRESS });
      try {
        task.startProgress();
      } catch (error) {
        expect(error).toBeInstanceOf(DomainRuleError);
        expect(error).toHaveProperty(
          'message',
          'Only pending tasks can be started.',
        );
        expect(error).toHaveProperty(
          'clientErrorCode',
          CLIENT_ERROR_CODE.IN_PROGRESS_OR_COMPLETED,
        );
      }
    });
  });

  describe('complete', () => {
    it('should change status to COMPLETED and set completedAt', () => {
      const task = createBaseTask({ status: TaskStatus.IN_PROGRESS });
      const completionDate = new Date('2025-07-25T14:00:00.000Z');
      jest.useFakeTimers().setSystemTime(completionDate);

      task.complete();

      expect(task.status).toBe(TaskStatus.COMPLETED);
      expect(task.completedAt).toEqual(completionDate);
      jest.useRealTimers();
    });

    it('should throw DomainRuleError if task is already COMPLETED', () => {
      const task = createBaseTask({ status: TaskStatus.COMPLETED });
      try {
        task.complete();
      } catch (error) {
        expect(error).toBeInstanceOf(DomainRuleError);
        expect(error).toHaveProperty(
          'message',
          'A completed task cannot be completed again.',
        );
      }
    });
  });

  describe('reopen', () => {
    it('should change status to PENDING and nullify completedAt', () => {
      const task = createBaseTask({
        status: TaskStatus.COMPLETED,
        completedAt: new Date(),
      });
      task.reopen();
      expect(task.status).toBe(TaskStatus.PENDING);
      expect(task.completedAt).toBeNull();
    });

    it('should throw DomainRuleError if task is not COMPLETED', () => {
      const task = createBaseTask({ status: TaskStatus.PENDING });
      try {
        task.reopen();
      } catch (error) {
        expect(error).toBeInstanceOf(DomainRuleError);
        expect(error).toHaveProperty(
          'message',
          'Only a completed task can be reopened.',
        );
      }
    });
  });

  describe('updateDetails', () => {
    it('should update the title, description, and dueDate when provided', () => {
      const task = createBaseTask();
      const newDueDate = new Date('2026-01-01T00:00:00.000Z');

      task.updateDetails({
        title: 'Updated Title',
        description: 'Updated Description',
        dueDate: newDueDate,
      });

      expect(task.title).toBe('Updated Title');
      expect(task.description).toBe('Updated Description');
      expect(task.dueDate).toBe(newDueDate);
    });

    it('should not update properties that are undefined', () => {
      const task = createBaseTask();
      const originalDescription = task.description;

      task.updateDetails({
        title: 'New Title Only',
        description: undefined,
      });

      expect(task.title).toBe('New Title Only');
      expect(task.description).toBe(originalDescription);
    });
  });
});
