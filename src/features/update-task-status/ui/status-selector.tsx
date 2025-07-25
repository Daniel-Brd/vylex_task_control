import { useStartTaskProgress, useCompleteTask, useReopenTask } from '@/entities/task/api/task-api';
import type { TaskStatus } from '@/entities/task/model/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui';
import { useEffect, useState } from 'react';

interface StatusSelectorProps {
  currentTaskStatus: TaskStatus;
  taskId: string;
  onStatusChange?: (newStatus: TaskStatus) => void;
}

export function StatusSelector({ currentTaskStatus, taskId, onStatusChange }: StatusSelectorProps) {
  const [localStatus, setLocalStatus] = useState<TaskStatus>(currentTaskStatus);

  const startTaskMutation = useStartTaskProgress({
    onSuccess: () => {
      setLocalStatus('IN_PROGRESS');
      onStatusChange?.('IN_PROGRESS');
    },
  });

  const completeTaskMutation = useCompleteTask({
    onSuccess: () => {
      setLocalStatus('COMPLETED');
      onStatusChange?.('COMPLETED');
    },
  });

  const reopenTaskMutation = useReopenTask({
    onSuccess: () => {
      setLocalStatus('PENDING');
      onStatusChange?.('PENDING');
    },
  });

  const handleStatusChange = (newStatus: TaskStatus) => {
    if (newStatus === localStatus) return;

    const handleConfig: Record<TaskStatus, () => void> = {
      PENDING: () => reopenTaskMutation.mutate(taskId),
      IN_PROGRESS: () => startTaskMutation.mutate(taskId),
      COMPLETED: () => completeTaskMutation.mutate(taskId),
    };

    handleConfig[newStatus]();
  };

  useEffect(() => {
    setLocalStatus(currentTaskStatus);
  }, [currentTaskStatus]);

  return (
    <Select value={localStatus} onValueChange={handleStatusChange} disabled={currentTaskStatus === 'COMPLETED'}>
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="PENDING">Pendente</SelectItem>
        <SelectItem value="IN_PROGRESS">Fazendo</SelectItem>
        <SelectItem value="COMPLETED">Finalizado</SelectItem>
      </SelectContent>
    </Select>
  );
}
