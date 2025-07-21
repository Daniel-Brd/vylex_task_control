/* eslint-disable @typescript-eslint/unbound-method */
import { CreateUserUseCase } from './create-user.use-case';
import { CreateUserCommand } from '../commands/create-user.command';
import { IUserRepository, User } from 'src/@core/domain/user';
import { IPasswordHasher } from 'src/@core/domain/auth/password-hasher.port';

const mockUserRepository: jest.Mocked<IUserRepository> = {
  create: jest.fn(),
  findByEmail: jest.fn(),
  findById: jest.fn(),
};

const mockPasswordHasher: jest.Mocked<IPasswordHasher> = {
  hash: jest.fn(),
  compare: jest.fn(),
};

jest.mock('src/@core/domain/user/user.entity');

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CreateUserUseCase(mockUserRepository, mockPasswordHasher);
  });

  it('should create a user, persist it, and return the new user ID', async () => {
    const command: CreateUserCommand = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'strong_password_123',
    };

    const mockCreatedUser = {
      id: 'user-id-123',
    };

    (User.create as jest.Mock).mockResolvedValue(mockCreatedUser);

    const result = await useCase.execute(command);

    expect(User.create).toHaveBeenCalledTimes(1);
    expect(User.create).toHaveBeenCalledWith(
      {
        name: command.name,
        email: command.email,
        password: command.password,
      },
      mockPasswordHasher,
    );

    expect(mockUserRepository.create).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.create).toHaveBeenCalledWith(mockCreatedUser);

    expect(result).toEqual({
      userId: 'user-id-123',
    });
  });
});
