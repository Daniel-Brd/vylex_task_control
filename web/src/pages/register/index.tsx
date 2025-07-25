import { RegisterCard } from '@/widgets/auth/';
import { useAuth } from '@/entities/session';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

function RegisterPage() {
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

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <RegisterCard />
      </div>
    </div>
  );
}

export default RegisterPage;
