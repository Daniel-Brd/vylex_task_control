import { lazy } from 'react';
import { Routes, Route } from 'react-router';

const Login = lazy(() => import('@/pages/login'));
const TaskBoard = lazy(() => import('@/pages/task-board'));

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<TaskBoard />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};
