import type { Task } from '../../model/types';

export type CreateTaskInputDto = Omit<Task, 'id' | 'status' | 'createdAt' | 'completedAt'>;
