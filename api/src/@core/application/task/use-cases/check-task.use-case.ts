import { ITaskRepository, Task } from 'src/@core/domain/task';
import {
  CLIENT_ERROR_CODE,
  NotFoundError,
  UnauthorizedError,
} from 'src/@core/errors/index.error';

export abstract class CheckTaskUseCase {
  constructor(protected readonly taskRepository: ITaskRepository) {}

  protected async findAndValidateTask(
    taskId: string,
    userId: string,
  ): Promise<Task> {
    const task = await this.taskRepository.findById(taskId);

    if (!task) {
      throw new NotFoundError(
        `Task with id ${taskId} not found.`,
        CLIENT_ERROR_CODE.TASK_NOT_FOUND,
      );
    }

    if (task.userId !== userId) {
      throw new UnauthorizedError(
        'User does not have permission to modify this task.',
        CLIENT_ERROR_CODE.IS_NOT_OWNER,
      );
    }

    return task;
  }
}
