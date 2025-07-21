import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Query,
  Patch,
  Param,
  ParseUUIDPipe,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateTaskCommand } from 'src/@core/application/task/commands/create-task.command';
import { UpdateTaskDetailsCommand } from 'src/@core/application/task/commands/update-task-details.command';
import { CompleteTaskUseCase } from 'src/@core/application/task/use-cases/complete-task.use-case';
import { CreateTaskUseCase } from 'src/@core/application/task/use-cases/create-task.use-case';
import { FindTasksByUserIdUseCase } from 'src/@core/application/task/use-cases/find-all-task.use-case';
import { ReopenTaskUseCase } from 'src/@core/application/task/use-cases/reopen-task.use-case';
import { StartTaskProgressUseCase } from 'src/@core/application/task/use-cases/start-task-progress.use-case';
import { UpdateTaskDetailsUseCase } from 'src/@core/application/task/use-cases/update-task-details.use-case';
import {
  CreateTaskInputDto,
  CreateTaskOutputDto,
} from 'src/@core/contracts/task/create-task.dto';
import { FindAllTasksQueryDto } from 'src/@core/contracts/task/find-all-tasks.dto';
import { UpdateTaskDetailsInputDto } from 'src/@core/contracts/task/update-task-details.dto';
import { TaskOutputDto } from 'src/@core/contracts/task/task-output.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { DeleteTaskCommand } from 'src/@core/application/task/commands/delete-task.command';
import { DeleteTaskUseCase } from 'src/@core/application/task/use-cases/delete-task.use-case';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly findTasksByUserIdUseCase: FindTasksByUserIdUseCase,
    private readonly startTaskProgressUseCase: StartTaskProgressUseCase,
    private readonly completeTaskUseCase: CompleteTaskUseCase,
    private readonly reopenTaskUseCase: ReopenTaskUseCase,
    private readonly updateTaskDetailsUseCase: UpdateTaskDetailsUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(201)
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
  ): Promise<TaskOutputDto[]> {
    return this.findTasksByUserIdUseCase.execute(query, req.user.userId);
  }
  @UseGuards(JwtAuthGuard)
  @Patch(':taskId/start-progress')
  async startProgress(
    @Req() req: AuthRequest,
    @Param('taskId', new ParseUUIDPipe()) taskId: string,
  ): Promise<TaskOutputDto> {
    const command = {
      taskId,
      userId: req.user.userId,
    };

    return this.startTaskProgressUseCase.execute(command);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':taskId/complete')
  async complete(
    @Req() req: AuthRequest,
    @Param('taskId', new ParseUUIDPipe()) taskId: string,
  ): Promise<TaskOutputDto> {
    const command = {
      taskId,
      userId: req.user.userId,
    };

    return this.completeTaskUseCase.execute(command);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':taskId/reopen')
  async reopen(
    @Req() req: AuthRequest,
    @Param('taskId', new ParseUUIDPipe()) taskId: string,
  ): Promise<TaskOutputDto> {
    const command = {
      taskId,
      userId: req.user.userId,
    };

    return this.reopenTaskUseCase.execute(command);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':taskId/update-details')
  async updateDetails(
    @Req() req: AuthRequest,
    @Param('taskId', new ParseUUIDPipe()) taskId: string,
    @Body() dto: UpdateTaskDetailsInputDto,
  ): Promise<TaskOutputDto> {
    const command: UpdateTaskDetailsCommand = {
      taskId,
      userId: req.user.userId,
      title: dto.title,
      description: dto.description,
      dueDate: dto.dueDate,
    };

    return this.updateTaskDetailsUseCase.execute(command);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':taskId')
  @HttpCode(204)
  async delete(
    @Req() req: AuthRequest,
    @Param('taskId', new ParseUUIDPipe()) taskId: string,
  ): Promise<void> {
    const command: DeleteTaskCommand = {
      taskId,
      userId: req.user.userId,
    };

    return this.deleteTaskUseCase.execute(command);
  }
}
