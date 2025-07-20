import { User } from './user.entity';

export interface IUserRepository {
  create(task: User): Promise<void>;
}
