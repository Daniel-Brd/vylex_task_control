export const TASK_STATUSES = ['PENDING', 'IN_PROGRESS', 'COMPLETED'] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: Date;
  createdAt: Date;
  completedAt: Date | null;
}
