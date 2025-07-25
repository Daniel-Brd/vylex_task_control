import { CheckCircle2, Circle, Pause } from 'lucide-react';
import type { Task } from './types';
import type { JSX } from 'react';

export const STATUS_DETAILS: Record<Task['status'], { label: string; icon: JSX.Element; color: string }> = {
  PENDING: {
    label: 'Pendente',
    icon: <Circle className="h-4 w-4 text-gray-400" />,
    color: 'bg-gray-100 text-gray-700 border-gray-200',
  },
  IN_PROGRESS: {
    label: 'Fazendo',
    icon: <Pause className="h-4 w-4 text-blue-500" />,
    color: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  COMPLETED: {
    label: 'Concluído',
    icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
    color: 'bg-green-100 text-green-700 border-green-200',
  },
};

export type DueDateStatus = 'overdue' | 'today' | 'soon' | 'completed' | 'normal';

export const DUE_DATE_COLOR_MAP: Record<DueDateStatus, string> = {
  overdue: 'text-red-600 bg-red-50',
  today: 'text-orange-600 bg-orange-50',
  soon: 'text-yellow-600 bg-yellow-50',
  completed: 'text-gray-500 bg-gray-50',
  normal: 'text-gray-600 bg-gray-50',
};
