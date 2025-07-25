import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/api';
import type { CreateTaskInputDto, CreateTaskOutputDto, GetTaskInputDto, GetTaskOutputDto, UpdateTaskInputDto } from '.';
import { mapTaskOutputDtoToTask } from './';
import type { Task } from '../model/types';
import { useAuth } from '@/entities/session';
import { toast } from 'sonner';
import { CLIENT_ERROR_CODE, handleApiError } from '@/shared/api/handle-api-error';

const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'lists'] as const,
  list: (params: GetTaskInputDto) => [...taskKeys.lists(), { params }] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
};

export const TASK_ERROR_MESSAGES: Record<string, string> = {
  [CLIENT_ERROR_CODE.IN_PROGRESS_OR_COMPLETED]: 'Apenas tarefas pendentes podem ser iniciadas.',
  [CLIENT_ERROR_CODE.NOT_COMPLETED]: 'Apenas tarefas concluídas podem ser reabertas.',
  [CLIENT_ERROR_CODE.ALREADY_COMPLETED]: 'Esta tarefa já foi finalizada.',
  [CLIENT_ERROR_CODE.IS_NOT_OWNER]: 'Você não é o dono desta tarefa.',
  [CLIENT_ERROR_CODE.TASK_NOT_FOUND]: 'Tarefa não encontrada.',
  [CLIENT_ERROR_CODE.INTERNAL_ERROR]: 'Ocorreu um erro inesperado.',
};

export const useGetTasks = (params: GetTaskInputDto) => {
  const { userId } = useAuth();

  return useQuery<GetTaskOutputDto[], Error, Task[]>({
    queryKey: taskKeys.list(params),
    queryFn: async () => {
      const { data } = await apiClient.get<GetTaskOutputDto[]>('/tasks', {
        params,
      });
      return data;
    },
    select: (data) => data.map((data) => mapTaskOutputDtoToTask(data, userId)),
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation<CreateTaskOutputDto, Error, CreateTaskInputDto>({
    mutationFn: async (payload) => {
      const { data } = await apiClient.post<CreateTaskOutputDto>('/tasks', payload);
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
};

export const useUpdateTaskDetails = (options?: { onSuccess?: (data: GetTaskOutputDto) => void; onError?: (error: Error) => void }) => {
  const { userId } = useAuth();

  const queryClient = useQueryClient();

  return useMutation<Task, Error, { taskId: string; payload: UpdateTaskInputDto }>({
    mutationFn: async ({ taskId, payload }) => {
      const { data } = await apiClient.patch<GetTaskOutputDto>(`/tasks/${taskId}/update-details`, payload);
      return mapTaskOutputDtoToTask(data, userId);
    },
    onSuccess: async (data) => {
      toast.success('Tarefa atualizada com sucesso!');
      await Promise.all([queryClient.invalidateQueries({ queryKey: taskKeys.lists() }), queryClient.invalidateQueries({ queryKey: taskKeys.detail(data.id) })]);
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      handleApiError(error, TASK_ERROR_MESSAGES);
      options?.onError?.(error);
    },
  });
};

export const useStartTaskProgress = (options?: { onSuccess?: (data: GetTaskOutputDto) => void; onError?: (error: Error) => void }) => {
  const queryClient = useQueryClient();
  return useMutation<GetTaskOutputDto, Error, string>({
    mutationFn: async (taskId) => {
      const { data } = await apiClient.patch<GetTaskOutputDto>(`/tasks/${taskId}/start-progress`);
      return data;
    },
    onSuccess: async (data) => {
      toast.success('Tarefa iniciada com sucesso!');
      await Promise.all([queryClient.invalidateQueries({ queryKey: taskKeys.lists() }), queryClient.invalidateQueries({ queryKey: taskKeys.detail(data.id) })]);
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      handleApiError(error, TASK_ERROR_MESSAGES);
      options?.onError?.(error);
    },
  });
};

export const useCompleteTask = (options?: { onSuccess?: (data: GetTaskOutputDto) => void; onError?: (error: Error) => void }) => {
  const queryClient = useQueryClient();
  return useMutation<GetTaskOutputDto, Error, string>({
    mutationFn: async (taskId) => {
      const { data } = await apiClient.patch<GetTaskOutputDto>(`/tasks/${taskId}/complete`);
      return data;
    },
    onSuccess: async (data) => {
      toast.success('Tarefa finalizada com sucesso!');
      await Promise.all([queryClient.invalidateQueries({ queryKey: taskKeys.lists() }), queryClient.invalidateQueries({ queryKey: taskKeys.detail(data.id) })]);
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      handleApiError(error, TASK_ERROR_MESSAGES);
      options?.onError?.(error);
    },
  });
};

export const useReopenTask = (options?: { onSuccess?: (data: GetTaskOutputDto) => void; onError?: (error: Error) => void }) => {
  const queryClient = useQueryClient();
  return useMutation<GetTaskOutputDto, Error, string>({
    mutationFn: async (taskId) => {
      const { data } = await apiClient.patch<GetTaskOutputDto>(`/tasks/${taskId}/reopen`);
      return data;
    },
    onSuccess: async (data) => {
      toast.success('Tarefa reaberta com sucesso!');
      await Promise.all([queryClient.invalidateQueries({ queryKey: taskKeys.lists() }), queryClient.invalidateQueries({ queryKey: taskKeys.detail(data.id) })]);
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      handleApiError(error, TASK_ERROR_MESSAGES);
      options?.onError?.(error);
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (taskId) => {
      await apiClient.delete(`/tasks/${taskId}/delete`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
};
