import { ITaskRepository } from 'src/@core/domain/task';
import { CheckTaskUseCase } from './check-task.use-case';
import { DeleteTaskCommand } from '../commands/delete-task.command';

export class DeleteTaskUseCase extends CheckTaskUseCase {
  constructor(protected readonly taskRepository: ITaskRepository) {
    super(taskRepository);
  }

  async execute(command: DeleteTaskCommand): Promise<void> {
    const { taskId, userId } = command;

    await this.findAndValidateTask(taskId, userId);

    return this.taskRepository.delete(taskId);
  }
}
