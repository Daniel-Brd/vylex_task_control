import { randomUUID } from 'crypto';
import {
  CLIENT_ERROR_CODE,
  DomainRuleError,
} from 'src/@core/errors/index.error';

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export interface TaskProps {
  readonly id: string;
  userId: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: Date;
  readonly createdAt: Date;
  completedAt: Date | null;
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

  private constructor(props: TaskProps) {
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

  public startProgress(): void {
    if (this.status !== TaskStatus.PENDING) {
      throw new DomainRuleError(
        'Only pending tasks can be started.',
        CLIENT_ERROR_CODE.IN_PROGRESS_OR_COMPLETED,
      );
    }
    this.status = TaskStatus.IN_PROGRESS;
  }

  public complete(): void {
    if (this.status === TaskStatus.COMPLETED) {
      throw new DomainRuleError(
        'A completed task cannot be completed again.',
        CLIENT_ERROR_CODE.ALREADY_COMPLETED,
      );
    }
    this.status = TaskStatus.COMPLETED;
    this.completedAt = new Date();
  }

  public reopen(): void {
    if (this.status !== TaskStatus.COMPLETED) {
      throw new DomainRuleError(
        'Only a completed task can be reopened.',
        CLIENT_ERROR_CODE.NOT_COMPLETED,
      );
    }
    this.status = TaskStatus.PENDING;
    this.completedAt = null;
  }

  public updateDetails(props: {
    title?: string;
    description?: string;
    dueDate?: Date;
  }): void {
    if (props.title !== undefined) {
      this.title = props.title;
    }
    if (props.description !== undefined) {
      this.description = props.description;
    }
    if (props.dueDate !== undefined) {
      this.dueDate = props.dueDate;
    }
  }

  static reconstitute(props: TaskProps): Task {
    return new Task(props);
  }
}
