import { randomUUID } from 'crypto';

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export class Task {
  readonly id: string;
  public userId: string;
  public title: string;
  public description: string;
  public status: TaskStatus;
  public dueDate: Date;
  public createdAt: Date;
  public completedAt: Date | null;

  private constructor(props: Task) {
    this.userId = props.userId;
    this.title = props.title;
    this.description = props.description;
    this.status = props.status;
    this.dueDate = props.dueDate;
    this.createdAt = props.createdAt;
    this.completedAt = props.completedAt;
    this.id = props.id;
  }

  public static create(props: {
    userId: string;
    title: string;
    description: string;
    dueDate: Date;
  }): Task {
    return new Task({
      id: randomUUID(),
      userId: props.userId,
      title: props.title,
      description: props.description,
      dueDate: props.dueDate,
      status: TaskStatus.PENDING,
      createdAt: new Date(),
      completedAt: null,
    });
  }

  static reconstitute(props: Task): Task {
    return new Task(props);
  }
}
