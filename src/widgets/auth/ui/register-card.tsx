import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui';
import { RegisterUserForm } from '@/features/auth/register-user';
import { useAuth } from '@/entities/session';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuthUser } from '@/entities/user';

export function RegisterCard() {
  const authUserMutation = useAuthUser();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleRegisterSuccess = async (userData: { email: string; password: string }) => {
    try {
      setSuccessMessage('Conta criada com sucesso! Fazendo login...');

      try {
        const { accessToken } = await authUserMutation.mutateAsync(userData);
        login(accessToken);
        void navigate('/task-board');
      } catch (error) {
        console.error('Erro no redirecionamento de login', error);
        void navigate('/login');
      }
    } catch (error) {
      console.error('Erro após cadastro:', error);
      void navigate('/login');
    }
  };

  const handleRegisterError = (error: string) => {
    console.error('Registration failed:', error);
    setSuccessMessage(null);
  };

  if (successMessage) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="text-green-600 text-lg font-medium">{successMessage}</div>
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Criar conta</CardTitle>
        <CardDescription className="text-center">Digite suas informações para criar uma nova conta</CardDescription>
      </CardHeader>

      <CardContent>
        <RegisterUserForm onSuccess={handleRegisterSuccess} onError={handleRegisterError} />

        <div className="mt-6 text-center text-sm">
          Já possui uma conta?{' '}
          <Link to="/login" className="underline underline-offset-4 hover:text-primary transition-colors">
            Fazer login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
