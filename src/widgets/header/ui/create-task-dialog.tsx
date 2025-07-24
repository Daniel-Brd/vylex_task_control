import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/ui';

import type { CreateTaskInputDto } from '@/entities/task/api';
import { TaskForm } from '@/features/create-task/ui';
import { useCreateTask } from '@/entities/task/api/task-api';

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskCreated?: (task: CreateTaskInputDto) => void;
}

export function CreateTaskDialog({ open, onOpenChange, onTaskCreated }: CreateTaskDialogProps) {
  const { mutateAsync, isPending } = useCreateTask();

  const handleSubmit = async (data: CreateTaskInputDto) => {
    try {
      await mutateAsync(data);
      onTaskCreated?.(data);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Criar Nova Tarefa</DialogTitle>
          <DialogDescription>Adicione uma nova tarefa à sua lista. Preencha os detalhes abaixo.</DialogDescription>
        </DialogHeader>

        <TaskForm onSubmit={(data) => void handleSubmit(data)} onCancel={handleCancel} isLoading={isPending} />
      </DialogContent>
    </Dialog>
  );
}
