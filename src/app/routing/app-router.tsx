import { lazy } from 'react';
import { Routes, Route } from 'react-router';
import { ProtectedRoute } from './protected-route';

const Login = lazy(() => import('@/pages/login'));
const TaskBoard = lazy(() => import('@/pages/task-board'));
const Register = lazy(() => import('@/pages/register'));
const Layout = lazy(() => import('@/app/layout/layout'));

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Layout />}>
          <Route path="task-board" element={<TaskBoard />} />
        </Route>
      </Route>
    </Routes>
  );
};
