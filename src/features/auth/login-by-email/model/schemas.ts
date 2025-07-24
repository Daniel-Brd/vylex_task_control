import { z } from 'zod';

export const loginByEmailSchema = z.object({
  email: z.email('Por favor, insira um email válido.'),
  password: z.string().min(3, 'A senha deve ter no mínimo 6 caracteres.'),
});

export type LoginByEmailFormValues = z.infer<typeof loginByEmailSchema>;
