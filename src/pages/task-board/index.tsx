import type { Task } from '@/entities/task/model/types';
import { TaskList } from '@/features/task-list/ui/task-list';
import { TaskDetailsSidebar } from '@/widgets/task/ui/task-detail-sidebar';
import { useState } from 'react';

const TaskBoard = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskDetails, setShowTaskDetails] = useState<boolean>(false);

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

  return (
    <div className="w-full">
      <TaskList selectedTask={selectedTask} onTaskClick={handleTaskClick} />
      {selectedTask && <TaskDetailsSidebar show={showTaskDetails} task={selectedTask} onOpenChange={handleSidebarClose} />}
    </div>
  );
};

export default TaskBoard;
