import { TaskCard } from '@/entities/task/ui/task-card';
import type { Task } from '@/entities/task/model/types';
import { getDueDateStatus } from '@/entities/task/model/lib';
import { useGetTasks } from '@/entities/task/api/task-api';

export interface TaskListProps {
  selectedTask: Task | null;
  onTaskClick: (task: Task) => void;
}

export function TaskList({ selectedTask, onTaskClick }: TaskListProps) {
  const tasks = useGetTasks({}).data;

  return (
    <div className="space-y-4">
      {tasks?.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          isSelected={selectedTask?.id === task.id}
          dueDateStatus={getDueDateStatus(task.dueDate, task.status)}
          onClick={() => onTaskClick(task)}
        />
      ))}
    </div>
  );
}
