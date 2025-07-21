/* eslint-disable @typescript-eslint/unbound-method */
import { CreateTaskUseCase } from './create-task.use-case';
import { CreateTaskCommand } from '../commands/create-task.command';
import { Task } from 'src/@core/domain/task';
import { mockTaskRepository } from './task-repository-test-mocks';

jest.mock('src/@core/domain/task/task.entity');

describe('CreateTaskUseCase', () => {
  let useCase: CreateTaskUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CreateTaskUseCase(mockTaskRepository);
  });

  it('should create a task, persist it, and return the new task ID', async () => {
    const command: CreateTaskCommand = {
      userId: 'user-id-123',
      title: 'Develop the authentication feature',
      description: 'Implement JWT-based authentication.',
      dueDate: new Date('2025-08-01T23:59:59.000Z'),
    };

    const mockCreatedTask = {
      id: 'task-id-123',
    };

    (Task.create as jest.Mock).mockReturnValue(mockCreatedTask);

    const result = await useCase.execute(command);

    expect(Task.create).toHaveBeenCalledTimes(1);
    expect(Task.create).toHaveBeenCalledWith({
      userId: command.userId,
      title: command.title,
      description: command.description,
      dueDate: command.dueDate,
    });

    expect(mockTaskRepository.create).toHaveBeenCalledTimes(1);
    expect(mockTaskRepository.create).toHaveBeenCalledWith(mockCreatedTask);

    expect(result).toEqual({
      taskId: 'task-id-123',
    });
  });
});
