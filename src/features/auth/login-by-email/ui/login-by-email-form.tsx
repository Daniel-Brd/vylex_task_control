import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Label } from '@/shared/ui';
import { loginByEmailSchema, type LoginByEmailFormValues } from '../model/schemas';
import { useAuthUser } from '@/entities/user/api/user-api';

interface LoginByEmailFormProps {
  onSuccess: (token: string) => void;
  onError: (error: string) => void;
}
export function LoginByEmailForm({ onError, onSuccess }: LoginByEmailFormProps) {
  const authUserMutation = useAuthUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginByEmailFormValues>({
    resolver: zodResolver(loginByEmailSchema),
  });

  const onSubmit = async (data: LoginByEmailFormValues) => {
    try {
      const { accessToken } = await authUserMutation.mutateAsync(data);
      onSuccess(accessToken);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Falha no login';
      onError(errorMessage);
    }
  };

  return (
    <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
      <div className="flex flex-col gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="email@example.com.br" {...register('email')} />
          {errors.email && <small className="text-sm text-red-500">{errors.email.message}</small>}
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password">Senha</Label>
          <Input id="password" type="password" {...register('password')} />
          {errors.password && <small className="text-sm text-red-500">{errors.password.message}</small>}
        </div>
        <div className="flex flex-col gap-3">
          <Button type="submit" className="w-full">
            Entrar
          </Button>
        </div>
      </div>
      <div className="mt-4 text-center text-sm">
        Não possui uma conta?{' '}
        <a href="#" className="underline underline-offset-4">
          Cadastrar
        </a>
      </div>
    </form>
  );
}
