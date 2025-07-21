/* eslint-disable @typescript-eslint/unbound-method */
import { randomUUID } from 'crypto';
import { Task, TaskStatus } from './task.entity';
import type * as Crypto from 'crypto';

jest.mock('crypto', (): typeof Crypto => ({
  ...jest.requireActual('crypto'),
  randomUUID: jest.fn(),
}));

describe('Task Entity', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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
      expect(task.userId).toBe(createProps.userId);
      expect(task.title).toBe(createProps.title);
      expect(task.description).toBe(createProps.description);
      expect(task.dueDate).toEqual(dueDate);
      expect(task.status).toBe(TaskStatus.PENDING);
      expect(task.createdAt).toEqual(fixedCreationDate);
      expect(task.completedAt).toBeNull();

      expect(randomUUID).toHaveBeenCalledTimes(1);

      jest.useRealTimers();
    });
  });
});
