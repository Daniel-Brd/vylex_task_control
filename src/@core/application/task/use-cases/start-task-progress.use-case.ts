import { ITaskRepository } from 'src/@core/domain/task';
import { StartTaskProgressCommand } from '../commands/start-task-progress.command';
import { CheckTaskUseCase } from './check-task.use-case';
import { TaskOutputDto } from 'src/@core/contracts/task/task-output.dto';

export class StartTaskProgressUseCase extends CheckTaskUseCase {
  constructor(protected readonly taskRepository: ITaskRepository) {
    super(taskRepository);
  }

  async execute(command: StartTaskProgressCommand): Promise<TaskOutputDto> {
    const { taskId, userId } = command;

    const task = await this.findAndValidateTask(taskId, userId);

    task.startProgress();

    const updated = await this.taskRepository.update(task);

    return TaskOutputDto.fromEntity(updated);
  }
}
