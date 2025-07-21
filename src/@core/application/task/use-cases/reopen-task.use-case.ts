import { ITaskRepository, Task } from 'src/@core/domain/task';
import { CheckTaskUseCase } from './check-task.use-case';
import { ReopenTaskCommand } from '../commands/reopen-task.command';

export class ReopenTaskUseCase extends CheckTaskUseCase {
  constructor(protected readonly taskRepository: ITaskRepository) {
    super(taskRepository);
  }

  async execute(command: ReopenTaskCommand): Promise<Task> {
    const { taskId, userId } = command;

    const task = await this.findAndValidateTask(taskId, userId);

    task.reopen();

    return this.taskRepository.update(task);
  }
}
