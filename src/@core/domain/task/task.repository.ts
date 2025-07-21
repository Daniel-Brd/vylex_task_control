import { TaskFilters } from './task-filters.type';
import { TaskOrderBy } from './task-order.type';
import { Task } from './task.entity';

export interface ITaskRepository {
  create(task: Task): Promise<void>;
  findById(taskId: string): Promise<Task | null>;
  findAllByUserId(
    userId: string,
    filters?: TaskFilters,
    orderBy?: TaskOrderBy,
  ): Promise<Task[]>;
  update(task: Task): Promise<Task>;
}
