/* eslint-disable @typescript-eslint/unbound-method */
import { ReopenTaskUseCase } from './reopen-task.use-case';
import { Task } from 'src/@core/domain/task';
import { ReopenTaskCommand } from '../commands/reopen-task.command';
import {
  CLIENT_ERROR_CODE,
  NotFoundError,
  UnauthorizedError,
} from 'src/@core/errors/index.error';
import { mockTaskRepository } from './task-repository-test-mocks';

describe('ReopenTaskUseCase', () => {
  let useCase: ReopenTaskUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new ReopenTaskUseCase(mockTaskRepository);
  });

  describe('execute', () => {
    const command: ReopenTaskCommand = {
      taskId: 'task-id-123',
      userId: 'user-id-123',
    };

    it('should successfully reopen a task and call the repository to update it', async () => {
      const mockTask = {
        id: command.taskId,
        userId: command.userId,
        reopen: jest.fn(),
      } as unknown as Task;

      mockTaskRepository.findById.mockResolvedValue(mockTask);
      mockTaskRepository.update.mockResolvedValue(mockTask);

      const result = await useCase.execute(command);

      expect(mockTaskRepository.findById).toHaveBeenCalledWith(command.taskId);
      expect(mockTask.reopen).toHaveBeenCalledTimes(1);
      expect(mockTaskRepository.update).toHaveBeenCalledWith(mockTask);
      expect(result).toBe(mockTask);
    });

    it('should throw NotFoundError domain error if the task to reopen is not found', async () => {
      mockTaskRepository.findById.mockResolvedValue(null);

      try {
        await useCase.execute(command);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError);
        expect(error).toHaveProperty(
          'message',
          `Task with id ${command.taskId} not found.`,
        );
        expect(error).toHaveProperty(
          'clientErrorCode',
          CLIENT_ERROR_CODE.TASK_NOT_FOUND,
        );
      }
    });

    it('should throw UnauthorizedError domain error if the user is not the task owner', async () => {
      const mockTask = {
        id: command.taskId,
        userId: 'another-owner-id',
        reopen: jest.fn(),
      } as unknown as Task;

      mockTaskRepository.findById.mockResolvedValue(mockTask);

      try {
        await useCase.execute(command);

        fail('Expected UnauthorizedError was not thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedError);
        expect(error).toHaveProperty(
          'message',
          'User does not have permission to modify this task.',
        );
        expect(error).toHaveProperty(
          'clientErrorCode',
          CLIENT_ERROR_CODE.IS_NOT_OWNER,
        );
      }
    });
  });
});
