import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/api';
import type { CreateTaskInputDto, CreateTaskOutputDto, GetTaskInputDto, GetTaskOutputDto, UpdateTaskInputDto } from '.';
import { mapTaskOutputDtoToTask } from './';
import type { Task } from '../model/types';
import { useAuth } from '@/entities/session';

const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'lists'] as const,
  list: (params: GetTaskInputDto) => [...taskKeys.lists(), { params }] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
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

export const useUpdateTaskDetails = () => {
  const { userId } = useAuth();

  const queryClient = useQueryClient();

  return useMutation<Task, Error, { taskId: string; payload: UpdateTaskInputDto }>({
    mutationFn: async ({ taskId, payload }) => {
      const { data } = await apiClient.patch<GetTaskOutputDto>(`/tasks/${taskId}/update-details`, payload);
      return mapTaskOutputDtoToTask(data, userId);
    },
    onSuccess: async (data) => {
      await Promise.all([queryClient.invalidateQueries({ queryKey: taskKeys.lists() }), queryClient.invalidateQueries({ queryKey: taskKeys.detail(data.id) })]);
    },
  });
};

export const useStartTaskProgress = () => {
  const queryClient = useQueryClient();
  return useMutation<GetTaskOutputDto, Error, string>({
    mutationFn: async (taskId) => {
      const { data } = await apiClient.patch<GetTaskOutputDto>(`/tasks/${taskId}/start-progress`);
      return data;
    },
    onSuccess: async (data) => {
      await Promise.all([queryClient.invalidateQueries({ queryKey: taskKeys.lists() }), queryClient.invalidateQueries({ queryKey: taskKeys.detail(data.id) })]);
    },
  });
};

export const useCompleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation<GetTaskOutputDto, Error, string>({
    mutationFn: async (taskId) => {
      const { data } = await apiClient.patch<GetTaskOutputDto>(`/tasks/${taskId}/complete`);
      return data;
    },
    onSuccess: async (data) => {
      await Promise.all([queryClient.invalidateQueries({ queryKey: taskKeys.lists() }), queryClient.invalidateQueries({ queryKey: taskKeys.detail(data.id) })]);
    },
  });
};

export const useReopenTask = () => {
  const queryClient = useQueryClient();
  return useMutation<GetTaskOutputDto, Error, string>({
    mutationFn: async (taskId) => {
      const { data } = await apiClient.patch<GetTaskOutputDto>(`/tasks/${taskId}/reopen`);
      return data;
    },
    onSuccess: async (data) => {
      await Promise.all([queryClient.invalidateQueries({ queryKey: taskKeys.lists() }), queryClient.invalidateQueries({ queryKey: taskKeys.detail(data.id) })]);
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
