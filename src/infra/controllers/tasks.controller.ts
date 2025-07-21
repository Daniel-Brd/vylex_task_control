import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateTaskCommand } from 'src/@core/application/task/commands/create-task.command';
import { CreateTaskUseCase } from 'src/@core/application/task/use-cases/create-task.use-case';
import { FindTasksByUserIdUseCase } from 'src/@core/application/task/use-cases/find-all-task.use-case';
import {
  CreateTaskInputDto,
  CreateTaskOutputDto,
} from 'src/@core/contracts/task/create-task.dto';
import { FindAllTasksQueryDto } from 'src/@core/contracts/task/find-all-tasks.dto';
import { Task } from 'src/@core/domain/task';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly findTasksByUserIdUseCase: FindTasksByUserIdUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() dto: CreateTaskInputDto,
    @Req() req: AuthRequest,
  ): Promise<CreateTaskOutputDto> {
    const command: CreateTaskCommand = {
      description: dto.description,
      dueDate: dto.dueDate,
      title: dto.title,
      userId: req.user.userId,
    };

    return this.createTaskUseCase.execute(command);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAllByUserId(
    @Req() req: AuthRequest,
    @Query() query: FindAllTasksQueryDto,
  ): Promise<Task[]> {
    return this.findTasksByUserIdUseCase.execute(query, req.user.userId);
  }
}
