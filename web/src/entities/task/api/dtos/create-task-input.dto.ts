import type { Task } from '../../model/types';

export type CreateTaskInputDto = Pick<Task, 'title' | 'description' | 'dueDate'>;
