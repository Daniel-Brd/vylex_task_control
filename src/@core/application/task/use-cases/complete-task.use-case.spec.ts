/* eslint-disable @typescript-eslint/unbound-method */
import { CompleteTaskUseCase } from './complete-task.use-case';
import { Task, TaskStatus } from 'src/@core/domain/task';
import { CompleteTaskCommand } from '../commands/complete-task.command';
import {
  CLIENT_ERROR_CODE,
  NotFoundError,
  UnauthorizedError,
} from 'src/@core/errors/index.error';
import { mockTaskRepository } from './task-repository-test-mocks';
import { fail } from 'assert';
import { TaskOutputDto } from 'src/@core/contracts/task/task-output.dto';

describe('CompleteTaskUseCase', () => {
  let useCase: CompleteTaskUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CompleteTaskUseCase(mockTaskRepository);
  });

  describe('execute', () => {
    const command: CompleteTaskCommand = {
      taskId: 'task-id-123',
      userId: 'user-id-123',
    };

    it('should successfully complete a task and return the updated task', async () => {
      const mockTask = {
        id: command.taskId,
        userId: command.userId,
        title: 'Task to be completed',
        description: 'Description.',
        status: TaskStatus.COMPLETED,
        dueDate: new Date('2025-08-01T23:59:59.000Z'),
        createdAt: new Date('2025-07-20T12:00:00.000Z'),
        completedAt: null,
        complete: jest.fn(),
      } as unknown as Task;

      mockTaskRepository.findById.mockResolvedValue(mockTask);
      mockTaskRepository.update.mockResolvedValue(mockTask);

      const result = await useCase.execute(command);

      expect(mockTaskRepository.findById).toHaveBeenCalledWith(command.taskId);
      expect(mockTask.complete).toHaveBeenCalledTimes(1);
      expect(mockTaskRepository.update).toHaveBeenCalledWith(mockTask);

      const expectedDto = TaskOutputDto.fromEntity(mockTask);

      expect(result).toEqual(expectedDto);
    });

    it('should throw NotFoundError domain error if the task to complete is not found', async () => {
      mockTaskRepository.findById.mockResolvedValue(null);

      try {
        await useCase.execute(command);
        fail('Expected NotFoundError domain error  was not thrown');
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
        complete: jest.fn(),
      } as unknown as Task;

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
      }
    });
  });
});
