import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router';
import { useState } from 'react';
import { EyeOffIcon, EyeIcon } from 'lucide-react';

import { Button, Input, Label } from '@/shared/ui';
import { loginByEmailSchema, type LoginByEmailFormValues } from '../model/schemas';
import { useLoginByEmail } from '@/entities/user/api/user-api';

interface LoginByEmailFormProps {
  onSuccess: (token: string) => void;
}

export function LoginByEmailForm({ onSuccess }: LoginByEmailFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useLoginByEmail({
    onSuccess: (data) => {
      onSuccess(data.accessToken);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginByEmailFormValues>({
    resolver: zodResolver(loginByEmailSchema),
  });

  const onSubmit = (data: LoginByEmailFormValues) => {
    loginMutation.mutate(data);
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
          <div className="relative">
            <Input id="password" type={showPassword ? 'text' : 'password'} {...register('password')} />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <small className="text-sm text-red-500">{errors.password.message}</small>}
        </div>
        <div className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? 'Entrando...' : 'Entrar'}
          </Button>
        </div>
      </div>
      <div className="mt-4 text-center text-sm">
        Não possui uma conta?{' '}
        <Link to="/register" className="underline underline-offset-4 hover:text-primary transition-colors">
          Cadastrar
        </Link>
      </div>
    </form>
  );
}
