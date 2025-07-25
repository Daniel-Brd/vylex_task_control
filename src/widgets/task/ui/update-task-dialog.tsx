import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/ui';

import type { UpdateTaskInputDto } from '@/entities/task/api';
import { useUpdateTaskDetails } from '@/entities/task/api/task-api';
import type { Task } from '@/entities/task/model/types';
import { UpdateTaskForm } from '../../../features/update-task/ui/update-task-form';
import type { Dispatch, SetStateAction } from 'react';

interface UpdateTaskDialogProps {
  task: Task;
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  onTaskUpdated?: (task: Task) => void;
}

export function UpdateTaskDialog({ task, show, setShow }: UpdateTaskDialogProps) {
  const { mutateAsync, isPending } = useUpdateTaskDetails({
    onSuccess: () => {
      setShow(false);
    },
    onError: () => {
      setShow(false);
    },
  });

  const handleSubmit = async (payload: UpdateTaskInputDto) => {
    await mutateAsync({ payload, taskId: task.id });
  };

  if (!task) return null;

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Tarefa</DialogTitle>
          <DialogDescription>Atualize os detalhes da sua tarefa abaixo.</DialogDescription>
        </DialogHeader>

        <UpdateTaskForm task={task} onSubmit={handleSubmit} onCancel={() => setShow(false)} isLoading={isPending} />
      </DialogContent>
    </Dialog>
  );
}
