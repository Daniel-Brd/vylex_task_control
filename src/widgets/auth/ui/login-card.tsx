import { useAuth } from '@/entities/session';
import { LoginByEmailForm } from '@/features/auth/login-by-email';
import { cn } from '@/shared/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui';
import { useNavigate } from 'react-router';

export function LoginCard({ className, ...props }: React.ComponentProps<'div'>) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSuccess = (token: string) => {
    login(token);
    void navigate('/task-board');
  };

  const handleLoginError = (error: string) => {
    console.error('Login failed:', error);
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Entre com sua conta</CardTitle>
          <CardDescription>Insira seu email abaixo para entrar com sua conta</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginByEmailForm onError={handleLoginError} onSuccess={handleLoginSuccess} />
        </CardContent>
      </Card>
    </div>
  );
}
