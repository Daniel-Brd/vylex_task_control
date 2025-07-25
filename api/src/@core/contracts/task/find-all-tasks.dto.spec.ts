import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { FindAllTasksQueryDto } from './find-all-tasks.dto';
import {
  TaskStatus,
  SortOrder,
  SortBy,
  NullsOrder,
} from 'src/@core/domain/task';

describe('FindAllTasksQueryDto', () => {
  it('should pass validation for an empty payload', async () => {
    const payload = {};
    const dto = plainToInstance(FindAllTasksQueryDto, payload);
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should pass validation when only valid filters are provided', async () => {
    const payload = {
      filters: {
        status: TaskStatus.PENDING,
      },
    };
    const dto = plainToInstance(FindAllTasksQueryDto, payload);
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should pass validation when only a valid orderBy is provided', async () => {
    const payload = {
      orderBy: {
        sortBy: SortBy.CREATED_AT,
        sortOrder: SortOrder.ASC,
      },
    };
    const dto = plainToInstance(FindAllTasksQueryDto, payload);
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should pass validation with all valid parameters, including nulls order', async () => {
    const payload = {
      filters: {
        status: TaskStatus.COMPLETED,
      },
      orderBy: {
        sortBy: SortBy.COMPLETED_AT,
        sortOrder: SortOrder.DESC,
        nulls: NullsOrder.FIRST,
      },
    };
    const dto = plainToInstance(FindAllTasksQueryDto, payload);
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should generate an error if a nested filter property is invalid', async () => {
    const payload = {
      filters: {
        status: 'INVALID_STATUS',
      },
    };
    const dto = plainToInstance(FindAllTasksQueryDto, payload);
    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('filters');

    const nestedError = errors[0].children?.[0];
    expect(nestedError?.property).toBe('status');
    expect(nestedError?.constraints).toHaveProperty('isEnum');
  });

  it('should generate an error if a required nested orderBy property is missing', async () => {
    const payload = {
      orderBy: {
        sortOrder: SortOrder.ASC,
      },
    };
    const dto = plainToInstance(FindAllTasksQueryDto, payload);
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('orderBy');
    const nestedError = errors[0].children?.[0];
    expect(nestedError?.property).toBe('sortBy');
    expect(nestedError?.constraints).toHaveProperty('isEnum');
  });

  it('should generate an error if a nested orderBy a property is invalid', async () => {
    const payload = {
      orderBy: {
        sortOrder: 'invalid-order',
      },
    };
    const dto = plainToInstance(FindAllTasksQueryDto, payload);
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('orderBy');
    const nestedError = errors[0].children?.[0];
    expect(nestedError?.property).toBe('sortOrder');
    expect(nestedError?.constraints).toHaveProperty('isEnum');
  });
});
