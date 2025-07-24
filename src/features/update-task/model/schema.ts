import { z } from 'zod';

export const updateTaskSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(100, 'Título deve ter no máximo 100 caracteres').trim(),
  description: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .max(255, 'Descrição deve ter no máximo 255 caracteres')
    .transform((val) => val?.trim() || ''),
  dueDate: z.date('Data de prazo é obrigatória').refine((date) => date >= new Date(new Date().setHours(0, 0, 0, 0)), {
    message: 'Data de prazo não pode ser no passado',
  }),
});

export type UpdateTaskFormData = z.infer<typeof updateTaskSchema>;
