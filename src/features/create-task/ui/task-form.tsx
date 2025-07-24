import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { Button, Calendar, Input, Label, Popover, PopoverContent, PopoverTrigger, Textarea } from '@/shared/ui';

import type { CreateTaskInputDto } from '@/entities/task/api';
import { createTaskSchema, type CreateTaskFormData } from '../model';

interface CreateTaskFormProps {
  onSubmit: (data: CreateTaskInputDto) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function TaskForm({ onSubmit, onCancel, isLoading = false }: CreateTaskFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    mode: 'onChange',
  });

  const handleFormSubmit = (data: CreateTaskFormData) => {
    onSubmit(data);
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  return (
    <form onSubmit={(e) => void handleSubmit(handleFormSubmit)(e)} className="space-y-4">
      <div className="grid gap-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="title">
            Título <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            {...register('title')}
            placeholder="Digite o título da tarefa"
            disabled={isLoading}
            className={cn(errors.title && 'border-red-500')}
          />
          {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">
            Descrição <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="description"
            {...register('description')}
            placeholder="Digite a descrição da tarefa"
            rows={3}
            disabled={isLoading}
            className={cn(errors.description && 'border-red-500')}
          />
          {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>
            Data de Prazo <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="dueDate"
            control={control}
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    disabled={isLoading}
                    className={cn('w-full justify-start text-left font-normal', !field.value && 'text-muted-foreground', errors.dueDate && 'border-red-500')}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? format(field.value, 'PPP', { locale: ptBR }) : 'Selecione uma data'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  />
                </PopoverContent>
              </Popover>
            )}
          />
          {errors.dueDate && <p className="text-sm text-red-500">{errors.dueDate.message}</p>}
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? 'Criando...' : 'Criar Tarefa'}
        </Button>
      </div>
    </form>
  );
}
