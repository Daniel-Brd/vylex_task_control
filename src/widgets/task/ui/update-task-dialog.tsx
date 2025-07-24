import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/ui';

import type { UpdateTaskInputDto } from '@/entities/task/api';
import { useUpdateTaskDetails } from '@/entities/task/api/task-api';
import type { Task } from '@/entities/task/model/types';
import { UpdateTaskForm } from '../../../features/update-task/ui/update-task-form';

interface UpdateTaskDialogProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskUpdated?: (task: Task) => void;
}

export function UpdateTaskDialog({ task, open, onOpenChange, onTaskUpdated }: UpdateTaskDialogProps) {
  const { mutateAsync, isPending, data, isSuccess } = useUpdateTaskDetails();

  const handleSubmit = async (payload: UpdateTaskInputDto) => {
    try {
      await mutateAsync({ payload, taskId: task.id });
      if (isSuccess) {
        onTaskUpdated?.(data);
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };
  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Tarefa</DialogTitle>
          <DialogDescription>Atualize os detalhes da sua tarefa abaixo.</DialogDescription>
        </DialogHeader>

        <UpdateTaskForm task={task} onSubmit={(data) => void handleSubmit(data)} onCancel={handleCancel} isLoading={isPending} />
      </DialogContent>
    </Dialog>
  );
}
