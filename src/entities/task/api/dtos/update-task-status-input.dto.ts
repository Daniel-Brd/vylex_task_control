import type { Task } from '../../model/types';

export type UpdateTaskInputDto = Pick<Task, 'status'>;
