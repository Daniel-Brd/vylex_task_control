import type { DueDateStatus } from './constants';
import type { Task } from './types';

export const getDueDateStatus = (dueDate: Date, status: Task['status']): DueDateStatus => {
  if (status === 'COMPLETED') return 'completed';

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tempDue = new Date(dueDate);
  const due = new Date(tempDue.getFullYear(), tempDue.getMonth(), tempDue.getDate());
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'overdue';
  if (diffDays === 0) return 'today';
  if (diffDays <= 3) return 'soon';
  return 'normal';
};

export const getDueDateText = (status: DueDateStatus, date: Date, completedAt: Date | null) => {
  const textMap: Record<DueDateStatus, string> = {
    overdue: 'Atrasado',
    today: 'Hoje',
    soon: `Vence em ${new Date(date).toLocaleDateString()}`,
    normal: `Vence em ${new Date(date).toLocaleDateString()}`,
    completed: `Finalizado em ${new Date(completedAt || '').toLocaleDateString()}`,
  };
  return textMap[status];
};
