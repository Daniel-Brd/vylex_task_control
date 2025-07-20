import { FindAllTasksQueryDto } from 'src/@core/contracts/task/find-all-tasks.dto';
import { ITaskRepository, Task } from 'src/@core/domain/task';
import { TaskFilters } from 'src/@core/domain/task/task-filters.type';
import { TaskOrderBy } from 'src/@core/domain/task/task-order.type';

export class FindTasksByUserIdUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(
    payload: FindAllTasksQueryDto,
    userId: string,
  ): Promise<Task[]> {
    const filters: TaskFilters = {
      status: payload.filters?.status,
    };

    let orderBy: TaskOrderBy | undefined;

    if (payload.orderBy) {
      const { sortBy, sortOrder, nulls } = payload.orderBy;
      orderBy = {
        nulls,
        sortBy,
        sortOrder,
      };
    }

    return this.taskRepository.findAllByUserId(userId, filters, orderBy);
  }
}
