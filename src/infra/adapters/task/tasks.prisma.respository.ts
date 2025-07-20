import { Injectable } from '@nestjs/common';
import { ITaskRepository, Task } from 'src/@core/domain/task';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { TaskMapper } from './task.mapper';
import { TaskFilters } from 'src/@core/domain/task/task-filters.type';
import { Prisma } from '@prisma/client';
import { TaskOrderBy } from 'src/@core/domain/task/task-order.type';

@Injectable()
export class TaskRepository implements ITaskRepository {
  constructor(private prisma: PrismaService) {}

  async create(task: Task): Promise<void> {
    const data = TaskMapper.toPersistence(task);

    await this.prisma.task.create({ data });
  }

  async findAllByUserId(
    userId: string,
    filters: TaskFilters,
    orderByParams: TaskOrderBy,
  ): Promise<Task[]> {
    const where = this.createWhereConditions({ ...filters, userId });
    const orderBy = this.createOrderBy(orderByParams);

    const tasks = await this.prisma.task.findMany({ where, orderBy });

    return tasks.map((task) => TaskMapper.toDomain(task));
  }

  protected createWhereConditions(filters: TaskFilters): Prisma.TaskWhereInput {
    const { userId, status } = filters;

    const whereConditions: Prisma.TaskWhereInput = {};

    if (userId) {
      whereConditions.userId = userId;
    }

    if (status) {
      whereConditions.status = status;
    }

    return whereConditions;
  }

  protected createOrderBy(
    orderBy: TaskOrderBy,
  ): Prisma.TaskOrderByWithRelationInput {
    if (!orderBy?.sortBy || !orderBy?.sortOrder) {
      return { createdAt: 'desc' };
    }

    const { sortBy, sortOrder, nulls } = orderBy;

    const nullableColumns = ['completedAt'] as const;

    function isNullable(
      column: string,
    ): column is (typeof nullableColumns)[number] {
      return (nullableColumns as readonly string[]).includes(column);
    }

    if (isNullable(sortBy)) {
      return {
        [sortBy]: {
          sort: sortOrder,
          nulls: nulls || 'last',
        },
      };
    }

    return {
      [sortBy]: sortOrder,
    };
  }
}
