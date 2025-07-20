import { Task } from './task.entity';

export interface ITaskRepository {
  create(task: Task): Promise<void>;
}
