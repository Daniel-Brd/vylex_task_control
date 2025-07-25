import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui';
import { RegisterUserForm } from '@/features/auth/register-user';
import { useAuth } from '@/entities/session';
import { Link, useNavigate } from 'react-router';

import { useLoginByEmail } from '@/entities/user';
import type { RegisterUserData } from '@/features/auth/register-user';

export function RegisterCard() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const loginMutation = useLoginByEmail({
    onSuccess: (data) => {
      login(data.accessToken);
      void navigate('/task-board');
    },
    onError: () => {
      void navigate('/login');
    },
  });

  const handleRegisterSuccess = (userData: RegisterUserData) => {
    loginMutation.mutate({
      email: userData.email,
      password: userData.password,
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Criar conta</CardTitle>
        <CardDescription className="text-center">Digite suas informações para criar uma nova conta</CardDescription>
      </CardHeader>

      <CardContent>
        <RegisterUserForm onSuccess={handleRegisterSuccess} />

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
