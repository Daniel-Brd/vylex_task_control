import { ITaskRepository } from 'src/@core/domain/task';
import { CheckTaskUseCase } from './check-task.use-case';
import { CompleteTaskCommand } from '../commands/complete-task.command';
import { TaskOutputDto } from 'src/@core/contracts/task/task-output.dto';

export class CompleteTaskUseCase extends CheckTaskUseCase {
  constructor(protected readonly taskRepository: ITaskRepository) {
    super(taskRepository);
  }

  async execute(command: CompleteTaskCommand): Promise<TaskOutputDto> {
    const { taskId, userId } = command;

    const task = await this.findAndValidateTask(taskId, userId);

    task.complete();

    const updated = await this.taskRepository.update(task);

    return TaskOutputDto.fromEntity(updated);
  }
}
