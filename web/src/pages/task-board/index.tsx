import type { GetTasksFilters, GetTasksOrderBy } from '@/entities/task/api';
import { useGetTasks } from '@/entities/task/api/task-api';
import type { Task } from '@/entities/task/model/types';
import { TaskFilters } from '@/features/task-list/ui/task-filters';
import { TaskList } from '@/features/task-list/ui/task-list';
import { TaskDetailsSidebar } from '@/widgets/task/ui/task-detail-sidebar';
import { useState } from 'react';

const TaskBoard = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskDetails, setShowTaskDetails] = useState<boolean>(false);
  const [filters, setFilters] = useState<GetTasksFilters | undefined>();
  const [orderBy, setOrderBy] = useState<GetTasksOrderBy | undefined>();

  const handleTaskClick = (task: Task) => {
    if (selectedTask?.id === task.id) {
      setShowTaskDetails((prev) => !prev);
    } else {
      setSelectedTask(task);
      setShowTaskDetails(true);
    }
  };

  const handleSidebarClose = () => {
    setShowTaskDetails(false);
  };

  const { data: tasks, isLoading } = useGetTasks({ filters, orderBy });

  return (
    <div className="w-full">
      <TaskFilters setFilter={setFilters} setOrderBy={setOrderBy} />
      {tasks?.length && !isLoading ? (
        <TaskList selectedTask={selectedTask} onTaskClick={handleTaskClick} tasks={tasks} />
      ) : (
        <div className="flex justify-center items-center h-full w-full">Crie sua próxima tarefa clicando no botão acima</div>
      )}
      {selectedTask && <TaskDetailsSidebar show={showTaskDetails} task={selectedTask} onOpenChange={handleSidebarClose} />}
    </div>
  );
};

export default TaskBoard;
