import { User } from './user.entity';

export interface IUserRepository {
  create(task: User): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}
