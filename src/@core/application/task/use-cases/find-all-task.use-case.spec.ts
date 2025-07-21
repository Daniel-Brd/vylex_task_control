/* eslint-disable @typescript-eslint/unbound-method */
import {
  Task,
  TaskStatus,
  SortBy,
  SortOrder,
  NullsOrder,
} from 'src/@core/domain/task';
import { FindTasksByUserIdUseCase } from './find-all-task.use-case';
import { FindAllTasksQueryDto } from 'src/@core/contracts/task/find-all-tasks.dto';
import { mockTaskRepository } from './task-repository-test-mocks';

describe('FindTasksByUserIdUseCase', () => {
  let useCase: FindTasksByUserIdUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new FindTasksByUserIdUseCase(mockTaskRepository);
  });

  const userId = 'user-id-123';

  it('should call the repository with correctly mapped filters and orderBy', async () => {
    const payload: FindAllTasksQueryDto = {
      filters: {
        status: TaskStatus.PENDING,
      },
      orderBy: {
        sortBy: SortBy.CREATED_AT,
        sortOrder: SortOrder.DESC,
      },
    };
    const mockTasks: Task[] = [];
    mockTaskRepository.findAllByUserId.mockResolvedValue(mockTasks);

    const result = await useCase.execute(payload, userId);

    expect(mockTaskRepository.findAllByUserId).toHaveBeenCalledTimes(1);
    expect(mockTaskRepository.findAllByUserId).toHaveBeenCalledWith(
      userId,
      { status: TaskStatus.PENDING },
      {
        sortBy: SortBy.CREATED_AT,
        sortOrder: SortOrder.DESC,
        nulls: undefined,
      },
    );
    expect(result).toBe(mockTasks);
  });

  it('should call the repository with undefined orderBy when not provided in payload', async () => {
    const payload: FindAllTasksQueryDto = {
      filters: {
        status: TaskStatus.IN_PROGRESS,
      },
    };

    await useCase.execute(payload, userId);

    expect(mockTaskRepository.findAllByUserId).toHaveBeenCalledWith(
      userId,
      { status: TaskStatus.IN_PROGRESS },
      undefined,
    );
  });

  it('should call the repository with empty filter object when filters are not provided', async () => {
    const payload: FindAllTasksQueryDto = {};

    await useCase.execute(payload, userId);

    expect(mockTaskRepository.findAllByUserId).toHaveBeenCalledWith(
      userId,
      undefined,
      undefined,
    );
  });

  it('should correctly pass all orderBy parameters, including nulls', async () => {
    const payload: FindAllTasksQueryDto = {
      orderBy: {
        sortBy: SortBy.COMPLETED_AT,
        sortOrder: SortOrder.ASC,
        nulls: NullsOrder.FIRST,
      },
    };

    await useCase.execute(payload, userId);

    expect(mockTaskRepository.findAllByUserId).toHaveBeenCalledWith(
      userId,
      undefined,
      {
        sortBy: SortBy.COMPLETED_AT,
        sortOrder: SortOrder.ASC,
        nulls: NullsOrder.FIRST,
      },
    );
  });

  it('should return the array of tasks from the repository', async () => {
    const payload: FindAllTasksQueryDto = {};
    const userId = 'user-id-123';

    const mockTasksResult: Partial<Task>[] = [
      { id: 'task-id-123', title: 'First Task' },
      { id: 'task-id-456', title: 'Second Task' },
    ];

    mockTaskRepository.findAllByUserId.mockResolvedValue(
      mockTasksResult as Task[],
    );

    const result = await useCase.execute(payload, userId);

    expect(result).toBe(mockTasksResult);
    expect(result).toHaveLength(2);
    expect(result[0].title).toBe('First Task');

    expect(mockTaskRepository.findAllByUserId).toHaveBeenCalledWith(
      userId,
      undefined,
      undefined,
    );
    expect(mockTaskRepository.findAllByUserId).toHaveBeenCalledTimes(1);
  });
});
