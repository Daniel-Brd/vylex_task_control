import { z } from 'zod';

export const registerUserSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Nome deve ter pelo menos 2 caracteres')
      .max(50, 'Nome deve ter no máximo 50 caracteres')
      .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços'),
    email: z.email('Email deve ter um formato válido').toLowerCase(),
    password: z
      .string()
      .min(8, 'Senha deve ter pelo menos 8 caracteres')
      .regex(/(?=.*[a-z])/, 'Senha deve conter pelo menos uma letra minúscula')
      .regex(/(?=.*[A-Z])/, 'Senha deve conter pelo menos uma letra maiúscula')
      .regex(/(?=.*\d)/, 'Senha deve conter pelo menos um número')
      .regex(/(?=.*[@$!%*?&])/, 'Senha deve conter pelo menos um caractere especial'),
    confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export type RegisterUserFormValues = z.infer<typeof registerUserSchema>;

export type RegisterUserData = Omit<RegisterUserFormValues, 'confirmPassword'>;
