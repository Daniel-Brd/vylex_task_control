import type { User, AuthToken, CreateUserData, LoginByEmailData } from '../model/types';
import type { AuthTokenOutputDto, CreateUserInputDto, CreateUserOutputDto, LoginByEmailInputDto } from '../lib/dto';

export const mapAuthTokenFromDto = (dto: AuthTokenOutputDto): AuthToken => ({
  accessToken: dto.access_token,
});

export const mapCreatedUserFromDto = (dto: CreateUserOutputDto): Pick<User, 'id'> => ({
  id: dto.id,
});

export const mapCreateUserToDto = (data: CreateUserData): CreateUserInputDto => ({
  name: data.name,
  email: data.email,
  password: data.password,
});

export const mapLoginToDto = (data: LoginByEmailData): LoginByEmailInputDto => ({
  email: data.email,
  password: data.password,
});
