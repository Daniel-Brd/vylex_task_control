import { TaskStatus } from './task.entity';

export type TaskFilters = {
  status?: TaskStatus;
  userId?: string;
};
