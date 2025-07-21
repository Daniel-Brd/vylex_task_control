/* eslint-disable @typescript-eslint/unbound-method */
import {
  ITaskRepository,
  Task,
  TaskStatus,
  SortBy,
  SortOrder,
  NullsOrder,
} from 'src/@core/domain/task';
import { FindTasksByUserIdUseCase } from './find-all-task.use-case';
import { FindAllTasksQueryDto } from 'src/@core/contracts/task/find-all-tasks.dto';

const mockTaskRepository: jest.Mocked<ITaskRepository> = {
  findAllByUserId: jest.fn(),
  create: jest.fn(),
};

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
});
