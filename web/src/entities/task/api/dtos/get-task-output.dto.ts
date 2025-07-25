import type { Task } from '../../model/types';

export type GetTaskOutputDto = Omit<Task, 'userId'>;
