import { ITaskRepository } from 'src/@core/domain/task';
import { CheckTaskUseCase } from './check-task.use-case';
import { ReopenTaskCommand } from '../commands/reopen-task.command';
import { TaskOutputDto } from 'src/@core/contracts/task/task-output.dto';

export class ReopenTaskUseCase extends CheckTaskUseCase {
  constructor(protected readonly taskRepository: ITaskRepository) {
    super(taskRepository);
  }

  async execute(command: ReopenTaskCommand): Promise<TaskOutputDto> {
    const { taskId, userId } = command;

    const task = await this.findAndValidateTask(taskId, userId);

    task.reopen();

    const updated = await this.taskRepository.update(task);

    return TaskOutputDto.fromEntity(updated);
  }
}
