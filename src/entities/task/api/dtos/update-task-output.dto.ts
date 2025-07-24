import type { Task } from '../../model/types';

export type UpdateTaskOutputDto = Omit<Task, 'userId'>;
