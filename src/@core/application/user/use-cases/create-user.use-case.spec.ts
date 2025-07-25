/* eslint-disable @typescript-eslint/unbound-method */
import { CreateUserUseCase } from './create-user.use-case';
import { CreateUserCommand } from '../commands/create-user.command';
import { IUserRepository, User } from 'src/@core/domain/user';
import { IPasswordHasher } from 'src/@core/domain/auth/password-hasher.port';
import {
  CLIENT_ERROR_CODE,
  EmailAlreadyExistsError,
} from 'src/@core/errors/index.error';

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

    mockUserRepository.findByEmail.mockResolvedValue(null);
    (User.create as jest.Mock).mockResolvedValue(mockCreatedUser);

    const result = await useCase.execute(command);

    expect(mockUserRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(command.email);

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

  it('should throw EmailAlreadyExistsError when email already exists', async () => {
    const command: CreateUserCommand = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'strong_password_123',
    };

    const existingUser = {
      id: 'existing-user-id',
      email: 'john.doe@example.com',
      name: 'Existing User',
    } as User;

    mockUserRepository.findByEmail.mockResolvedValue(existingUser);

    try {
      await useCase.execute(command);
      fail('Expected EmailAlreadyExistsError to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(EmailAlreadyExistsError);
      expect(error).toHaveProperty(
        'message',
        'A User with this email already exists',
      );
      expect(error).toHaveProperty(
        'clientErrorCode',
        CLIENT_ERROR_CODE.EMAIL_ALREADY_EXISTS,
      );
    }

    expect(mockUserRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(command.email);

    expect(User.create).not.toHaveBeenCalled();
    expect(mockUserRepository.create).not.toHaveBeenCalled();
  });
});
