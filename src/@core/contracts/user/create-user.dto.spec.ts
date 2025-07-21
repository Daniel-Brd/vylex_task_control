import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateUserInputDto, CreateUserOutputDto } from './create-user.dto';

describe('CreateUserInputDto', () => {
  it('should pass validation with a valid payload', async () => {
    const payload = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    };
    const dto = plainToInstance(CreateUserInputDto, payload);
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation if name is empty', async () => {
    const payload = {
      name: '',
      email: 'john.doe@example.com',
      password: 'password123',
    };
    const dto = plainToInstance(CreateUserInputDto, payload);
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('name');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail validation if email is not a valid email address', async () => {
    const payload = {
      name: 'John Doe',
      email: 'invalid-email',
      password: 'password123',
    };
    const dto = plainToInstance(CreateUserInputDto, payload);
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('email');
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });

  it('should fail validation if password is not a string', async () => {
    const payload = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 12345,
    };
    const dto = plainToInstance(CreateUserInputDto, payload);
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('password');
    expect(errors[0].constraints).toHaveProperty('isString');
  });
});

describe('CreateUserOutputDto', () => {
  it('should pass validation with a valid UUID', async () => {
    const payload = {
      userId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    };
    const dto = plainToInstance(CreateUserOutputDto, payload);
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation if userId is not a valid UUID', async () => {
    const payload = {
      userId: 'invalid-uuid-string',
    };
    const dto = plainToInstance(CreateUserOutputDto, payload);
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('userId');
    expect(errors[0].constraints).toHaveProperty('isUuid');
  });
});
