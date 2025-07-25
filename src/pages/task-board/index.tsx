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

  const tasks = useGetTasks({ filters, orderBy }).data;

  return (
    <div className="w-full">
      <TaskFilters setFilter={setFilters} setOrderBy={setOrderBy} />
      {tasks?.length && <TaskList selectedTask={selectedTask} onTaskClick={handleTaskClick} tasks={tasks} />}
      {selectedTask && <TaskDetailsSidebar show={showTaskDetails} task={selectedTask} onOpenChange={handleSidebarClose} />}
    </div>
  );
};

export default TaskBoard;
