import type { Task } from '../model/types';
import type { GetTaskOutputDto } from './dtos/get-task-output.dto';

export function mapTaskOutputDtoToTask(dto: GetTaskOutputDto, userId: string | null): Task {
  if (!userId) {
    throw new Error('erro ao mapear task, user id não encontrado');
  }
  const task: Task = { ...dto, userId };

  return task;
}
