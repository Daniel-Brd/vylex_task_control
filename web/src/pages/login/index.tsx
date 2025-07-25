import { useAuth } from '@/entities/session';
import { LoginCard } from '@/widgets/auth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

const Login = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      void navigate('/task-board');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  if (isAuthenticated) return null;

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-lg">
        <LoginCard />
      </div>
    </div>
  );
};

export default Login;
