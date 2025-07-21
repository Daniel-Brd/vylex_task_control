import { FindAllTasksQueryDto } from 'src/@core/contracts/task/find-all-tasks.dto';
import { TaskOutputDto } from 'src/@core/contracts/task/task-output.dto';
import { ITaskRepository } from 'src/@core/domain/task';
import { TaskFilters } from 'src/@core/domain/task/task-filters.type';
import { TaskOrderBy } from 'src/@core/domain/task/task-order.type';

export class FindTasksByUserIdUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(
    payload: FindAllTasksQueryDto,
    userId: string,
  ): Promise<TaskOutputDto[]> {
    const filters: TaskFilters | undefined = payload.filters;
    const orderBy: TaskOrderBy | undefined = payload.orderBy;

    const tasks = await this.taskRepository.findAllByUserId(
      userId,
      filters,
      orderBy,
    );

    return tasks.map((task) => TaskOutputDto.fromEntity(task));
  }
}
