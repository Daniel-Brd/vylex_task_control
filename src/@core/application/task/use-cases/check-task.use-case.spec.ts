/* eslint-disable @typescript-eslint/unbound-method */
import { ITaskRepository, Task } from 'src/@core/domain/task';
import {
  CLIENT_ERROR_CODE,
  NotFoundError,
  UnauthorizedError,
} from 'src/@core/errors/index.error';
import { CheckTaskUseCase } from './check-task.use-case';
import { mockTaskRepository } from './task-repository-test-mocks';

class TestableCheckTaskUseCase extends CheckTaskUseCase {
  constructor(taskRepository: ITaskRepository) {
    super(taskRepository);
  }

  public async testFindAndValidateTask(
    taskId: string,
    userId: string,
  ): Promise<Task> {
    return this.findAndValidateTask(taskId, userId);
  }
}

describe('CheckTaskUseCase', () => {
  let useCase: TestableCheckTaskUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new TestableCheckTaskUseCase(mockTaskRepository);
  });

  describe('findAndValidateTask', () => {
    const taskId = 'task-id-123';
    const ownerUserId = 'user-id-123';

    it('should return the task when it is found and the user is the owner', async () => {
      const mockTask = { id: taskId, userId: ownerUserId } as Task;
      mockTaskRepository.findById.mockResolvedValue(mockTask);

      const result = await useCase.testFindAndValidateTask(taskId, ownerUserId);

      expect(result).toBe(mockTask);
      expect(mockTaskRepository.findById).toHaveBeenCalledWith(taskId);
      expect(mockTaskRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundError domain error if the task does not exist', async () => {
      const taskId = 'task-id-123';
      const ownerUserId = 'user-id-123';
      mockTaskRepository.findById.mockResolvedValue(null);

      try {
        await useCase.testFindAndValidateTask(taskId, ownerUserId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError);

        expect(error).toHaveProperty(
          'message',
          `Task with id ${taskId} not found.`,
        );
        expect(error).toHaveProperty(
          'clientErrorCode',
          CLIENT_ERROR_CODE.TASK_NOT_FOUND,
        );
      }
    });

    it('should throw UnauthorizedError domain error if the user is not the task owner', async () => {
      const anotherUserId = 'another-user-id-456';
      const mockTask = { id: taskId, userId: ownerUserId } as Task;
      mockTaskRepository.findById.mockResolvedValue(mockTask);

      try {
        await useCase.testFindAndValidateTask(taskId, anotherUserId);
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
