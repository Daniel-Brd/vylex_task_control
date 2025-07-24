import type { Task } from '../../model/types';

export type UpdateTaskInputDto = Partial<Pick<Task, 'title' | 'description' | 'dueDate'>>;
