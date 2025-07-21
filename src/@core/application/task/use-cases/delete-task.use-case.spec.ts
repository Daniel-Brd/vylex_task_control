/* eslint-disable @typescript-eslint/unbound-method */
import { DeleteTaskUseCase } from './delete-task.use-case';
import { Task } from 'src/@core/domain/task';
import { DeleteTaskCommand } from '../commands/delete-task.command';
import {
  CLIENT_ERROR_CODE,
  NotFoundError,
  UnauthorizedError,
} from 'src/@core/errors/index.error';
import { fail } from 'assert';
import { mockTaskRepository } from './task-repository-test-mocks';

describe('DeleteTaskUseCase', () => {
  let useCase: DeleteTaskUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new DeleteTaskUseCase(mockTaskRepository);
  });

  describe('execute', () => {
    const command: DeleteTaskCommand = {
      taskId: 'task-id-123',
      userId: 'user-id-123',
    };

    it('should successfully find and delete a task', async () => {
      const mockTask = { id: command.taskId, userId: command.userId } as Task;
      mockTaskRepository.findById.mockResolvedValue(mockTask);

      mockTaskRepository.delete.mockResolvedValue(undefined);

      await useCase.execute(command);

      expect(mockTaskRepository.findById).toHaveBeenCalledWith(command.taskId);
      expect(mockTaskRepository.delete).toHaveBeenCalledWith(command.taskId);
      expect(mockTaskRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundError domain error if the task to delete is not found', async () => {
      mockTaskRepository.findById.mockResolvedValue(null);

      try {
        await useCase.execute(command);
        fail('Expected NotFoundError domain error was not thrown');
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
        expect(mockTaskRepository.delete).not.toHaveBeenCalled();
      }
    });

    it('should throw UnauthorizedError domain error if the user is not the task owner', async () => {
      const mockTask = {
        id: command.taskId,
        userId: 'another-owner-id',
      } as Task;
      mockTaskRepository.findById.mockResolvedValue(mockTask);

      try {
        await useCase.execute(command);
        fail('Expected UnauthorizedError domain error was not thrown');
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
        expect(mockTaskRepository.delete).not.toHaveBeenCalled();
      }
    });
  });
});
