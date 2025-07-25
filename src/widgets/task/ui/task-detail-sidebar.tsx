import { Button, Card, CardContent, CardHeader, CardTitle, Separator, Sheet, SheetContent, SheetHeader, SheetTitle } from '@/shared/ui';
import { Calendar, Clock, Edit, Trash2 } from 'lucide-react';
import { UpdateTaskDialog } from './update-task-dialog';
import type { Task, TaskStatus } from '@/entities/task/model/types';
import { useEffect, useState } from 'react';
import { useReopenTask } from '@/entities/task/api/task-api';
import { formatDateTime } from '@/shared/lib/utils';
import { StatusSelector } from '@/features/update-task-status';
import { toast } from 'sonner';
import { DeleteTaskDialog } from '@/features/delete-task';

export interface TaskDetailsSidebarProps {
  task: Task;
  show: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskUpdate?: (updatedTask: Partial<Task>) => void;
}

export function TaskDetailsSidebar(props: TaskDetailsSidebarProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task>(props.task);

  const toggleDeleteDialog = () => {
    setShowDeleteDialog((prev) => !prev);
  };

  const reopenTaskMutation = useReopenTask({
    onSuccess: () => {
      const updatedTask = { ...currentTask, status: 'PENDING' as TaskStatus, completedAt: null };
      setCurrentTask(updatedTask);
      props.onTaskUpdate?.(updatedTask);
      toast.success('Tarefa reaberta com sucesso!');
    },
  });

  const { onOpenChange, show } = props;

  useEffect(() => {
    setCurrentTask(props.task);
  }, [props.task]);

  const handleStatusChange = (newStatus: TaskStatus) => {
    const updatedTask = {
      ...currentTask,
      status: newStatus,
      completedAt: newStatus === 'COMPLETED' ? new Date() : null,
    };
    setCurrentTask(updatedTask);
    props.onTaskUpdate?.(updatedTask);
  };

  const handleTaskDeletion = () => {
    onOpenChange(false);
  };

  if (!currentTask) return null;

  return (
    <>
      <Sheet open={show} onOpenChange={onOpenChange}>
        <SheetContent className="w-[400px] sm:w-[500px] p-0">
          <div className="flex flex-col h-full">
            <SheetHeader className="p-6 pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <SheetTitle className="text-xl font-bold line-clamp-2">{currentTask.title}</SheetTitle>
                </div>
              </div>
            </SheetHeader>

            <div className="flex-1 overflow-auto px-6">
              <div className="space-y-6">
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowEditDialog(true)} className="flex-1">
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  <Button variant="outline" onClick={toggleDeleteDialog} className="text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir
                  </Button>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Descrição</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{currentTask.description}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Detalhes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Status</label>
                      <div className="mt-2">
                        <StatusSelector currentTaskStatus={currentTask.status} taskId={currentTask.id} onStatusChange={handleStatusChange} />
                      </div>
                      {currentTask.status === 'COMPLETED' && (
                        <Button
                          variant="outline"
                          className="w-full mt-2"
                          onClick={() => reopenTaskMutation.mutate(currentTask.id)}
                          disabled={reopenTaskMutation.isPending}
                        >
                          {reopenTaskMutation.isPending ? 'Reabrindo...' : 'Reabrir'}
                        </Button>
                      )}
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Criado em:</span>
                        <span>{formatDateTime(currentTask.createdAt)}</span>
                      </div>

                      {currentTask.dueDate && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Prazo:</span>
                          <span>{formatDateTime(currentTask.dueDate)}</span>
                        </div>
                      )}

                      {currentTask.completedAt && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Finalizado em:</span>
                          <span>{formatDateTime(currentTask.completedAt)}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <UpdateTaskDialog task={currentTask} show={showEditDialog} setShow={setShowEditDialog} />
      <DeleteTaskDialog
        show={showDeleteDialog}
        setShow={setShowDeleteDialog}
        taskId={currentTask.id}
        taskTitle={currentTask.title}
        onSuccess={handleTaskDeletion}
      />
    </>
  );
}
