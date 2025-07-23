import { lazy } from 'react';
import { Routes, Route } from 'react-router';

const Login = lazy(() => import('@/pages/login'));

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};
