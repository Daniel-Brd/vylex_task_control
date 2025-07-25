import { Exclude, Expose } from 'class-transformer';
import { Task, TaskStatus } from 'src/@core/domain/task';

@Exclude()
export class TaskOutputDto {
  @Expose()
  public readonly id: string;
  @Expose()
  public readonly title: string;
  @Expose()
  public readonly description: string;
  @Expose()
  public readonly status: TaskStatus;
  @Expose()
  public readonly dueDate: Date;
  @Expose()
  public readonly createdAt: Date;
  @Expose()
  public readonly completedAt: Date | null;

  private constructor(props: Partial<TaskOutputDto>) {
    Object.assign(this, props);
  }

  public static fromEntity(task: Task): TaskOutputDto {
    return new TaskOutputDto({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      dueDate: task.dueDate,
      createdAt: task.createdAt,
      completedAt: task.completedAt,
    });
  }
}
