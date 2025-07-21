import { ITaskRepository } from 'src/@core/domain/task';
import { CheckTaskUseCase } from './check-task.use-case';
import { UpdateTaskDetailsCommand } from '../commands/update-task-details.command';
import { TaskOutputDto } from 'src/@core/contracts/task/update-task-output.dto';

export class UpdateTaskDetailsUseCase extends CheckTaskUseCase {
  constructor(protected readonly taskRepository: ITaskRepository) {
    super(taskRepository);
  }

  async execute(command: UpdateTaskDetailsCommand): Promise<TaskOutputDto> {
    const { taskId, userId, description, dueDate, title } = command;

    const task = await this.findAndValidateTask(taskId, userId);

    task.updateDetails({ description, dueDate, title });

    const updated = await this.taskRepository.update(task);

    return TaskOutputDto.fromEntity(updated);
  }
}
