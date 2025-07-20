import { ITaskRepository, Task } from 'src/@core/domain/task';
import { CreateTaskCommand } from '../commands/create-task.command';
import { CreateTaskOutputDto } from 'src/@core/contracts/task/create-task.dto';

export class CreateTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(command: CreateTaskCommand): Promise<CreateTaskOutputDto> {
    const { description, dueDate, title, userId } = command;

    const task = Task.create({ description, dueDate, title, userId });

    await this.taskRepository.create(task);

    return {
      taskId: task.id,
    };
  }
}
