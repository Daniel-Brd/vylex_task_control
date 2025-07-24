import { useMutation } from '@tanstack/react-query';

import { apiClient } from '@/shared/api';
import type { AuthTokenOutputDto } from '../lib/dto/auth-token-output.dto';
import type { CreateUserOutputDto } from '../lib/dto/create-user-output.dto';
import type { AuthToken, CreateUserData, LoginByEmailData, User } from '../model';
import { mapAuthTokenFromDto, mapCreatedUserFromDto, mapCreateUserToDto, mapLoginToDto } from './mappers';

const userKeys = {
  all: ['users'] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

export const loginByEmail = async (data: LoginByEmailData): Promise<AuthToken> => {
  const dto = mapLoginToDto(data);
  const response = await apiClient.post<AuthTokenOutputDto>('/auth/login', dto);
  return mapAuthTokenFromDto(response.data);
};

export const createUser = async (data: CreateUserData): Promise<Pick<User, 'id'>> => {
  const dto = mapCreateUserToDto(data);
  const response = await apiClient.post<CreateUserOutputDto>('/users', dto);
  return mapCreatedUserFromDto(response.data);
};

export const useAuthUser = () => {
  return useMutation({
    mutationFn: loginByEmail,
    mutationKey: ['auth', 'login'],
  });
};

export const useCreateUser = () => {
  return useMutation({
    mutationFn: createUser,
    mutationKey: ['users', 'create'],
  });
};
