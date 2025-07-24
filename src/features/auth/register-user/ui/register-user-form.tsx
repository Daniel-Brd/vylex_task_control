import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Label } from '@/shared/ui';
import { useCreateUser } from '@/entities/user';
import { registerUserSchema, type RegisterUserFormValues, type RegisterUserData } from '../model';
import { useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

interface RegisterUserFormProps {
  onSuccess: (userData: RegisterUserData) => Promise<void>;
  onError: (error: string) => void;
}

export function RegisterUserForm({ onSuccess, onError }: RegisterUserFormProps) {
  const createUserMutation = useCreateUser();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<RegisterUserFormValues>({
    resolver: zodResolver(registerUserSchema),
    mode: 'onBlur',
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterUserFormValues) => {
    try {
      const userData: RegisterUserData = {
        name: data.name,
        email: data.email,
        password: data.password,
      };

      const response = await createUserMutation.mutateAsync(userData);
      console.log('Usuário criado com sucesso!', response);
      await onSuccess(userData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Falha ao criar usuário';
      console.error('Falha no cadastro:', errorMessage);
      onError(errorMessage);
    }
  };

  return (
    <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
      <div className="flex flex-col gap-6">
        <div className="grid gap-3">
          <Label htmlFor="name">Nome</Label>
          <Input id="name" type="text" placeholder="João Silva" {...register('name')} />
          {errors.name && <small className="text-sm text-red-500">{errors.name.message}</small>}
        </div>
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="email@exemplo.com.br" {...register('email')} />
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
        <div className="grid gap-3">
          <Label htmlFor="confirmPassword">Confirmar senha</Label>
          <div className="relative">
            <Input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} {...register('confirmPassword')} />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && <small className="text-sm text-red-500">{errors.confirmPassword.message}</small>}
        </div>
        {password && (
          <div className="text-xs text-gray-600">
            <div className="mb-1">Sua senha deve conter:</div>
            <ul className="space-y-1">
              <li className={password.length >= 8 ? 'text-green-600' : 'text-red-500'}>✓ Pelo menos 8 caracteres</li>
              <li className={/(?=.*[a-z])/.test(password) ? 'text-green-600' : 'text-red-500'}>✓ Uma letra minúscula</li>
              <li className={/(?=.*[A-Z])/.test(password) ? 'text-green-600' : 'text-red-500'}>✓ Uma letra maiúscula</li>
              <li className={/(?=.*\d)/.test(password) ? 'text-green-600' : 'text-red-500'}>✓ Um número</li>
              <li className={/(?=.*[@$!%*?&])/.test(password) ? 'text-green-600' : 'text-red-500'}>✓ Um caractere especial (@$!%*?&)</li>
            </ul>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
        </Button>
      </div>
    </form>
  );
}
