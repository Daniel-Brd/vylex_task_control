'use client';

import { getDueDateStatus } from '@/entities/task/model/lib';
import { useGetTasks } from '@/entities/task/api/task-api';
import type { Task } from '@/entities/task/model/types';
import { TaskCard } from '@/entities/task/ui/task-card';
import { Circle } from 'lucide-react';
import { useState } from 'react';

export function TaskList() {
  const tasks = useGetTasks({});

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  if (tasks.data?.length === 0 && !tasks.isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <Circle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">Nenhuma tarefa encontrada</p>
          <p className="text-sm">Crie uma nova tarefa ou ajuste os filtros</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      {tasks.isLoading ? (
        <div>carregando tarrefas</div>
      ) : tasks.data?.length ? (
        tasks.data?.map((task) => {
          const dueDateStatus = getDueDateStatus(task.dueDate, task.status);
          return <TaskCard task={task} key={task.id} isSelected={selectedTask?.id === task.id} dueDateStatus={dueDateStatus} onSelectTask={setSelectedTask} />;
        })
      ) : (
        <div>falha ao buscar tarefas</div>
      )}
    </div>
  );
}
