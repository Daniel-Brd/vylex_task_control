import { type User } from '../../model/types';

export type CreateUserOutputDto = Pick<User, 'id'>;
