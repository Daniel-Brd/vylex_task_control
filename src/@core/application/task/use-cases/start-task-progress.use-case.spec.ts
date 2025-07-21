/* eslint-disable @typescript-eslint/unbound-method */
import { StartTaskProgressUseCase } from './start-task-progress.use-case';
import { Task } from 'src/@core/domain/task';
import { StartTaskProgressCommand } from '../commands/start-task-progress.command';
import {
  CLIENT_ERROR_CODE,
  NotFoundError,
  UnauthorizedError,
} from 'src/@core/errors/index.error';
import { mockTaskRepository } from './task-repository-test-mocks';

describe('StartTaskProgressUseCase', () => {
  let useCase: StartTaskProgressUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new StartTaskProgressUseCase(mockTaskRepository);
  });

  describe('execute', () => {
    const command: StartTaskProgressCommand = {
      taskId: 'task-id-123',
      userId: 'user-id-123',
    };

    it('should successfully start a task progress and call the repository to update it', async () => {
      const mockTask = {
        id: command.taskId,
        userId: command.userId,
        startProgress: jest.fn(),
      } as unknown as Task;

      mockTaskRepository.findById.mockResolvedValue(mockTask);
      mockTaskRepository.update.mockResolvedValue(mockTask);

      const result = await useCase.execute(command);

      expect(mockTaskRepository.findById).toHaveBeenCalledWith(command.taskId);
      expect(mockTask.startProgress).toHaveBeenCalledTimes(1);
      expect(mockTaskRepository.update).toHaveBeenCalledWith(mockTask);
      expect(result).toBe(mockTask);
    });

    it('should throw NotFoundError domain error if the task to start is not found', async () => {
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
        startProgress: jest.fn(),
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
