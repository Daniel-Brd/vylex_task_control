import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { Button, Calendar, Input, Label, Popover, PopoverContent, PopoverTrigger, Textarea } from '@/shared/ui';

import type { UpdateTaskInputDto } from '@/entities/task/api';
import type { Task } from '@/entities/task/model/types';
import { updateTaskSchema, type UpdateTaskFormData } from '../model';
import { useMemo } from 'react';

interface UpdateTaskFormProps {
  task: Task;
  onSubmit: (data: UpdateTaskInputDto) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function UpdateTaskForm({ task, onSubmit, onCancel, isLoading = false }: UpdateTaskFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty, dirtyFields },
  } = useForm<UpdateTaskFormData>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      title: task.title,
      description: task.description,
      dueDate: new Date(task.dueDate),
    },
    mode: 'onChange',
  });

  const hasErrors = useMemo(() => !!Object.keys(errors).length, [errors]);

  const handleFormSubmit = async (data: UpdateTaskFormData) => {
    const changedFields: Partial<UpdateTaskFormData> = {};

    if (dirtyFields.title) {
      changedFields.title = data.title;
    }

    if (dirtyFields.description) {
      changedFields.description = data.description;
    }

    if (dirtyFields.dueDate) {
      changedFields.dueDate = data.dueDate;
    }
    await onSubmit(changedFields);
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
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            {...register('description')}
            placeholder="Digite a descrição da tarefa (opcional)"
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
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" disabled={hasErrors || isLoading || !isDirty} className="flex-1">
          {isLoading ? 'Atualizando...' : 'Atualizar Tarefa'}
        </Button>
      </div>
    </form>
  );
}
