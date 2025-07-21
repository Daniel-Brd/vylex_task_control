import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateTaskInputDto, CreateTaskOutputDto } from './create-task.dto';

describe('CreateTaskInputDto', () => {
  describe('Validation', () => {
    it('should pass validation for a valid payload', async () => {
      const payload = {
        title: 'Complete documentation',
        description: 'Write the final docs for the API.',
        dueDate: '2025-08-01T23:59:59.000Z',
      };
      const dto = plainToInstance(CreateTaskInputDto, payload);
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should generate an error if title is empty', async () => {
      const payload = {
        title: '',
        description: 'Description is okay.',
        dueDate: '2025-08-01T23:59:59.000Z',
      };
      const dto = plainToInstance(CreateTaskInputDto, payload);
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('title');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should generate an error if dueDate is not a valid date', async () => {
      const payload = {
        title: 'Valid title',
        description: 'Valid description',
        dueDate: 'not-a-date',
      };
      const dto = plainToInstance(CreateTaskInputDto, payload);
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('dueDate');
      expect(errors[0].constraints).toHaveProperty('isDate');
    });
  });

  describe('Transformation', () => {
    it('should transform a date string into a Date object', () => {
      const payload = {
        title: 'Test Transformation',
        description: 'Check the date type.',
        dueDate: '2025-08-01T23:59:59.000Z',
      };
      const dto = plainToInstance(CreateTaskInputDto, payload);
      expect(dto.dueDate).toBeInstanceOf(Date);
    });
  });
});

describe('CreateTaskOutputDto', () => {
  it('should pass validation for a valid UUID', async () => {
    const payload = {
      taskId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    };
    const dto = plainToInstance(CreateTaskOutputDto, payload);
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should generate an error if taskId is not a valid UUID', async () => {
    const payload = {
      taskId: 'not-a-valid-uuid',
    };
    const dto = plainToInstance(CreateTaskOutputDto, payload);
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('taskId');
    expect(errors[0].constraints).toHaveProperty('isUuid');
  });
});
