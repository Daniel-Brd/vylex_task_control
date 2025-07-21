import { TaskFilters } from './task-filters.type';
import { TaskOrderBy } from './task-order.type';
import { Task } from './task.entity';

export interface ITaskRepository {
  create(task: Task): Promise<void>;
  findAllByUserId(
    userId: string,
    filters?: TaskFilters,
    orderBy?: TaskOrderBy,
  ): Promise<Task[]>;
}
