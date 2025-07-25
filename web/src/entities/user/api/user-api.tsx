import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { apiClient } from '@/shared/api';
import { CLIENT_ERROR_CODE, handleApiError } from '@/shared/api/handle-api-error';
import type { AuthTokenOutputDto } from '../lib/dto/auth-token-output.dto';
import type { CreateUserOutputDto } from '../lib/dto/create-user-output.dto';
import type { AuthToken, CreateUserData, LoginByEmailData, User } from '../model';
import { mapAuthTokenFromDto, mapCreatedUserFromDto, mapCreateUserToDto, mapLoginToDto } from './mappers';

const userKeys = {
  all: ['users'] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

export const USER_ERROR_MESSAGES: Record<string, string> = {
  [CLIENT_ERROR_CODE.INVALID_CREDENTIALS]: 'E-mail ou senha inválidos.',
  [CLIENT_ERROR_CODE.INTERNAL_ERROR]: 'Ocorreu um erro inesperado. Tente novamente.',
  [CLIENT_ERROR_CODE.USER_NOT_FOUND]: 'Usuário não encontrado.',
  [CLIENT_ERROR_CODE.EMAIL_ALREADY_EXISTS]: 'Já existe um usuário com este e-mail. Tente fazer login',
};

export const useLoginByEmail = (options?: { onSuccess?: (data: AuthToken) => void; onError?: (error: Error) => void }) => {
  const queryClient = useQueryClient();

  return useMutation<AuthToken, Error, LoginByEmailData>({
    mutationFn: async (loginData) => {
      const dto = mapLoginToDto(loginData);
      const { data } = await apiClient.post<AuthTokenOutputDto>('/auth/login', dto);
      return mapAuthTokenFromDto(data);
    },
    onSuccess: async (data) => {
      toast.success('Login realizado com sucesso!');

      await queryClient.invalidateQueries();
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      handleApiError(error, USER_ERROR_MESSAGES);
      options?.onError?.(error);
    },
  });
};

export const useCreateUser = (options?: { onSuccess?: (data: Pick<User, 'id'>) => void; onError?: (error: Error) => void }) => {
  return useMutation<Pick<User, 'id'>, Error, CreateUserData>({
    mutationFn: async (createUserData) => {
      const dto = mapCreateUserToDto(createUserData);
      const { data } = await apiClient.post<CreateUserOutputDto>('/users', dto);
      return mapCreatedUserFromDto(data);
    },
    onSuccess: (data) => {
      toast.success('Usuário criado com sucesso!');
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      handleApiError(error, USER_ERROR_MESSAGES);
      options?.onError?.(error);
    },
  });
};
