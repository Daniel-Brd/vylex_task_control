/* eslint-disable @typescript-eslint/unbound-method */
import { randomUUID } from 'crypto';
import { User } from './user.entity';
import { IPasswordHasher } from '../auth/password-hasher.port';
import type * as Crypto from 'crypto';

jest.mock('crypto', (): typeof Crypto => ({
  ...jest.requireActual('crypto'),
  randomUUID: jest.fn(),
}));

const mockPasswordHasher: IPasswordHasher = {
  hash: jest.fn(),
  compare: jest.fn(),
};

describe('User Entity', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user with a hashed password and generated properties', async () => {
      const fixedUUID = 'user-id-123';
      const fixedDate = new Date('2025-07-20T12:00:00.000Z');
      const plainPassword = 'password';
      const hashedPassword = 'hashed-password';

      (randomUUID as jest.Mock).mockReturnValue(fixedUUID);
      (mockPasswordHasher.hash as jest.Mock).mockResolvedValue(hashedPassword);
      jest.useFakeTimers().setSystemTime(fixedDate);

      const createProps = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: plainPassword,
      };

      const user = await User.create(createProps, mockPasswordHasher);

      expect(user).toBeInstanceOf(User);
      expect(user.id).toBe(fixedUUID);
      expect(user.name).toBe(createProps.name);
      expect(user.email).toBe(createProps.email);
      expect(user.password).toBe(hashedPassword);
      expect(user.createdAt).toEqual(fixedDate);
      expect(user.updatedAt).toEqual(fixedDate);

      expect(mockPasswordHasher.hash).toHaveBeenCalledWith(plainPassword);
      expect(mockPasswordHasher.hash).toHaveBeenCalledTimes(1);

      jest.useRealTimers();
    });
  });

  describe('reconstitute', () => {
    it('should create a User instance from existing data without changes', () => {
      const existingUserProps = {
        id: 'existing-user-id-123',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        password: 'hashed-password',
        createdAt: new Date('2024-01-15T10:00:00.000Z'),
        updatedAt: new Date('2025-03-10T18:30:00.000Z'),
      };

      const user = User.reconstitute(existingUserProps);

      expect(user).toBeInstanceOf(User);
      expect(user.id).toBe(existingUserProps.id);
      expect(user.name).toBe(existingUserProps.name);
      expect(user.password).toBe(existingUserProps.password);
      expect(user.createdAt).toEqual(existingUserProps.createdAt);
      expect(user.updatedAt).toEqual(existingUserProps.updatedAt);
    });
  });
});
