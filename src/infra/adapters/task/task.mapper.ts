import { Task as PrismaTask } from '@prisma/client';
import { Task } from 'src/@core/domain/task';

export class TaskMapper {
  public static toPersistence(domainTask: Task): PrismaTask {
    const data: PrismaTask = {
      id: domainTask.id,
      userId: domainTask.userId,
      title: domainTask.title,
      description: domainTask.description,
      status: domainTask.status as PrismaTask['status'],
      dueDate: domainTask.dueDate,
      createdAt: domainTask.createdAt,
      completedAt: domainTask.completedAt,
    };

    return data;
  }

  public static toDomain(prismaTask: PrismaTask): Task {
    const task = Task.reconstitute({
      id: prismaTask.id,
      userId: prismaTask.userId,
      title: prismaTask.title,
      description: prismaTask.description,
      status: prismaTask.status as Task['status'],
      dueDate: prismaTask.dueDate,
      createdAt: prismaTask.createdAt,
      completedAt: prismaTask.completedAt,
    });

    return task;
  }
}
