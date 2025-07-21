/* eslint-disable @typescript-eslint/unbound-method */
import { ReopenTaskUseCase } from './reopen-task.use-case';
import { Task, TaskStatus } from 'src/@core/domain/task';
import { ReopenTaskCommand } from '../commands/reopen-task.command';
import {
  CLIENT_ERROR_CODE,
  NotFoundError,
  UnauthorizedError,
} from 'src/@core/errors/index.error';
import { mockTaskRepository } from './task-repository-test-mocks';
import { TaskOutputDto } from 'src/@core/contracts/task/task-output.dto';
import { fail } from 'assert';

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

    it('should successfully reopen a task and return the correct DTO', async () => {
      const mockTask = {
        id: command.taskId,
        userId: command.userId,
        title: 'A Reopened Task',
        description: 'Description.',
        status: TaskStatus.PENDING,
        dueDate: new Date('2025-08-01T23:59:59.000Z'),
        createdAt: new Date('2025-07-20T12:00:00.000Z'),
        completedAt: null,
        reopen: jest.fn(),
      } as unknown as Task;

      mockTaskRepository.findById.mockResolvedValue(mockTask);
      mockTaskRepository.update.mockResolvedValue(mockTask);

      const result = await useCase.execute(command);

      expect(mockTaskRepository.findById).toHaveBeenCalledWith(command.taskId);
      expect(mockTask.reopen).toHaveBeenCalledTimes(1);
      expect(mockTaskRepository.update).toHaveBeenCalledWith(mockTask);

      const expectedDto = TaskOutputDto.fromEntity(mockTask);

      expect(result).toBeInstanceOf(TaskOutputDto);
      expect(result).toEqual(expectedDto);
    });

    it('should throw NotFoundError domain error if the task to reopen is not found', async () => {
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
