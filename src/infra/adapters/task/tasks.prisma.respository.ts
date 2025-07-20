import { Injectable } from '@nestjs/common';
import { ITaskRepository, Task } from 'src/@core/domain/task';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { TaskMapper } from './task.mapper';

@Injectable()
export class TaskRepository implements ITaskRepository {
  constructor(private prisma: PrismaService) {}

  async create(task: Task): Promise<void> {
    const data = TaskMapper.toPersistence(task);

    await this.prisma.task.create({ data });
  }
}
