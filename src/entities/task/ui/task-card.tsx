'use client';

import { cn } from '@/shared/lib/utils';
import { Card, CardContent, Badge } from '@/shared/ui';
import { Calendar, Clock } from 'lucide-react';
import type { Task } from '../model/types';
import { getDueDateText } from '../model/lib';
import { DUE_DATE_COLOR_MAP, STATUS_DETAILS, type DueDateStatus } from '../model/constants';

export interface TaskCardProps {
  task: Task;
  isSelected: boolean;
  dueDateStatus: DueDateStatus;
  onSelectTask: (task: Task) => void;
}

export function TaskCard(props: TaskCardProps) {
  const { isSelected, onSelectTask, dueDateStatus } = props;
  const { title, description, dueDate, status, createdAt, completedAt } = props.task;

  const statusDetails = STATUS_DETAILS[status];

  const dueDateColor = DUE_DATE_COLOR_MAP[dueDateStatus];
  const dueDateText = getDueDateText(dueDateStatus, dueDate, completedAt);

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-md border',
        isSelected && 'ring-2 ring-blue-500 shadow-md',
        status === 'COMPLETED' && 'opacity-75',
      )}
      onClick={() => {
        onSelectTask(props.task);
      }}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2 flex-1">
            {statusDetails.icon}
            <h3 className={cn('font-medium text-gray-900 truncate', status === 'COMPLETED' && 'line-through text-gray-500')}>{title}</h3>
          </div>
          <Badge variant="outline" className={cn('ml-2 text-xs', statusDetails.color)}>
            {statusDetails.label}
          </Badge>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-4">
            <div className={cn('flex items-center space-x-1 px-2 py-1 rounded-full', dueDateColor)}>
              <Calendar className="h-3 w-3" />
              <span>{dueDateText}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-gray-500">
            <Clock className="h-3 w-3" />
            <span>Criado em {new Date(createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
