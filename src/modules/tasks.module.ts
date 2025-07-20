import { Module } from '@nestjs/common';
import { TasksController } from '../infra/controllers/tasks.controller';
import { CreateTaskUseCase } from 'src/@core/application/task/use-cases/create-task.use-case';
import { ITaskRepository } from 'src/@core/domain/task';
import { TaskRepository } from 'src/infra/adapters/task/tasks.prisma.respository';
import { PrismaService } from 'src/infra/prisma/prisma.service';

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
  ],
})
export class TasksModule {}
