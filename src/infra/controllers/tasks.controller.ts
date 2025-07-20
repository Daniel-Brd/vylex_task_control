import { Controller, Post, Body } from '@nestjs/common';
import { CreateTaskCommand } from 'src/@core/application/task/commands/create-task.command';
import { CreateTaskUseCase } from 'src/@core/application/task/use-cases/create-task.use-case';
import {
  CreateTaskInputDto,
  CreateTaskOutputDto,
} from 'src/@core/contracts/task/create-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly createTaskUseCase: CreateTaskUseCase) {}

  @Post()
  async create(@Body() dto: CreateTaskInputDto): Promise<CreateTaskOutputDto> {
    const command: CreateTaskCommand = {
      description: dto.description,
      dueDate: dto.dueDate,
      title: dto.title,
      userId: '5bd21e8a-8df0-48bd-bef2-21e7aaa61e2b',
    };

    return this.createTaskUseCase.execute(command);
  }
}
