import { ITaskRepository, Task } from 'src/@core/domain/task';
import { StartTaskProgressCommand } from '../commands/start-task-progress.command';
import { CheckTaskUseCase } from './check-task.use-case';

export class StartTaskProgressUseCase extends CheckTaskUseCase {
  constructor(protected readonly taskRepository: ITaskRepository) {
    super(taskRepository);
  }

  async execute(command: StartTaskProgressCommand): Promise<Task> {
    const { taskId, userId } = command;

    const task = await this.findAndValidateTask(taskId, userId);

    task.startProgress();

    return this.taskRepository.update(task);
  }
}
