import type { Task } from '../model/types';
import type { GetTaskOutputDto } from './dtos/get-task-output.dto';

export function mapTaskOutputDtoToTask(dto: GetTaskOutputDto): Task {
  // pegar id pelo storage

  const task: Task = { ...dto, userId: 'user.id' };

  return task;
}
