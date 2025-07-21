import { ITaskRepository } from 'src/@core/domain/task';

export const mockTaskRepository: jest.Mocked<ITaskRepository> = {
  findById: jest.fn(),
  create: jest.fn(),
  findAllByUserId: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};
