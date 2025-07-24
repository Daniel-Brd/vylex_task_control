import { useAuth } from '@/entities/session';
import { Header } from '@/widgets/header';
import { CreateTaskDialog } from '@/widgets/header/ui/create-task-dialog';
import { useState } from 'react';
import { Outlet } from 'react-router';

const Layout = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { logout } = useAuth();

  const onClickCreateTask = () => {
    setShowCreateDialog(true);
  };

  const onClickLogout = () => {
    logout();
  };

  return (
    <>
      <CreateTaskDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
      <Header onClickLogout={onClickLogout} onClickCreateTask={onClickCreateTask} />
      <Outlet />
    </>
  );
};

export default Layout;
