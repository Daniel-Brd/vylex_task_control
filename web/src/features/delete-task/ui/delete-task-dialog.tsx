import { useDeleteTask } from '@/entities/task/api/task-api';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui';
import type { Dispatch, SetStateAction } from 'react';

interface DeleteTaskDialogProps {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  taskId: string;
  taskTitle: string;
  onSuccess?: () => void;
}

export function DeleteTaskDialog({ show, setShow, taskId, taskTitle, onSuccess }: DeleteTaskDialogProps) {
  const { mutate, isPending } = useDeleteTask({
    onSuccess: () => {
      setShow(false);
      onSuccess?.();
    },
    onError: () => {
      setShow(false);
    },
  });

  const handleDelete = () => {
    mutate(taskId);
  };

  return (
    <AlertDialog open={show} onOpenChange={setShow}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente a tarefa <span className="font-semibold text-foreground">"{taskTitle}"</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending} className="bg-red-600 hover:bg-red-700">
            {isPending ? 'Excluindo...' : 'Confirmar Exclusão'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
