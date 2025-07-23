import { LoginByEmailForm } from '@/features/auth/login-by-email';
import { cn } from '@/shared/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui';

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Entre com sua conta</CardTitle>
          <CardDescription>Insira seu email abaixo para entrar com sua conta</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginByEmailForm />
        </CardContent>
      </Card>
    </div>
  );
}
