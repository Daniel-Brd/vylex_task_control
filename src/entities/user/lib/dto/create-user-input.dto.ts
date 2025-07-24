import { type User } from '../../model/types';

export type CreateUserInputDto = Pick<User, 'name' | 'email' | 'password'>;
