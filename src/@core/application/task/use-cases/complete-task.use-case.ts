import { ITaskRepository, Task } from 'src/@core/domain/task';
import { CheckTaskUseCase } from './check-task.use-case';
import { CompleteTaskCommand } from '../commands/complete-task.command';

export class CompleteTaskUseCase extends CheckTaskUseCase {
  constructor(protected readonly taskRepository: ITaskRepository) {
    super(taskRepository);
  }

  async execute(command: CompleteTaskCommand): Promise<Task> {
    const { taskId, userId } = command;

    const task = await this.findAndValidateTask(taskId, userId);

    task.complete();

    return this.taskRepository.update(task);
  }
}
