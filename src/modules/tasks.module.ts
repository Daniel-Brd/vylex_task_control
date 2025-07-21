import { Module } from '@nestjs/common';
import { TasksController } from '../infra/controllers/tasks.controller';
import { CreateTaskUseCase } from 'src/@core/application/task/use-cases/create-task.use-case';
import { ITaskRepository } from 'src/@core/domain/task';
import { TaskRepository } from 'src/infra/adapters/task/tasks.prisma.respository';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { FindTasksByUserIdUseCase } from 'src/@core/application/task/use-cases/find-all-task.use-case';
import { StartTaskProgressUseCase } from 'src/@core/application/task/use-cases/start-task-progress.use-case';
import { CompleteTaskUseCase } from 'src/@core/application/task/use-cases/complete-task.use-case';
import { ReopenTaskUseCase } from 'src/@core/application/task/use-cases/reopen-task.use-case';
import { UpdateTaskDetailsUseCase } from 'src/@core/application/task/use-cases/update-task-details.use-case';

@Module({
  controllers: [TasksController],
  providers: [
    PrismaService,
    { provide: 'ITaskRepository', useClass: TaskRepository },
    {
      provide: CreateTaskUseCase,
      useFactory: (taskRepository: ITaskRepository) =>
        new CreateTaskUseCase(taskRepository),
      inject: ['ITaskRepository'],
    },
    {
      provide: FindTasksByUserIdUseCase,
      useFactory: (taskRepository: ITaskRepository) =>
        new FindTasksByUserIdUseCase(taskRepository),
      inject: ['ITaskRepository'],
    },
    {
      provide: StartTaskProgressUseCase,
      useFactory: (taskRepository: ITaskRepository) =>
        new StartTaskProgressUseCase(taskRepository),
      inject: ['ITaskRepository'],
    },
    {
      provide: CompleteTaskUseCase,
      useFactory: (taskRepository: ITaskRepository) =>
        new CompleteTaskUseCase(taskRepository),
      inject: ['ITaskRepository'],
    },
    {
      provide: ReopenTaskUseCase,
      useFactory: (taskRepository: ITaskRepository) =>
        new ReopenTaskUseCase(taskRepository),
      inject: ['ITaskRepository'],
    },
    {
      provide: UpdateTaskDetailsUseCase,
      useFactory: (taskRepository: ITaskRepository) =>
        new UpdateTaskDetailsUseCase(taskRepository),
      inject: ['ITaskRepository'],
    },
  ],
})
export class TasksModule {}
