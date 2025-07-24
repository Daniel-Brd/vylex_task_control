import { lazy } from 'react';
import { Routes, Route } from 'react-router';
import { ProtectedRoute } from './protected-route';

const Login = lazy(() => import('@/pages/login'));
const TaskBoard = lazy(() => import('@/pages/task-board'));

export const AppRouter = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/task-board" element={<TaskBoard />} />
      </Route>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};
