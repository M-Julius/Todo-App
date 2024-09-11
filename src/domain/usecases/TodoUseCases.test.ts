import { TodoUseCases } from './TodoUseCases';
import { Todo } from '../entities/Todo';

const mockRepository = {
  getTodos: jest.fn(),
  saveTodos: jest.fn(),
};

describe('Todo UseCases', () => {
  let todoUseCases: TodoUseCases;

  beforeEach(() => {
    todoUseCases = new TodoUseCases(mockRepository);
  });

  it('should add a new todo', async () => {
    mockRepository.getTodos.mockResolvedValueOnce([]);
    await todoUseCases.addTodo('New Task');

    expect(mockRepository.saveTodos).toHaveBeenCalledWith([
      expect.objectContaining({
        text: 'New Task',
        completed: false,
      }),
    ]);
  });

  it('should toggle completion of a todo', async () => {
    const todos = [new Todo('1', 'Task 1', false)];
    mockRepository.getTodos.mockResolvedValueOnce(todos);

    await todoUseCases.toggleComplete('1');
    expect(mockRepository.saveTodos).toHaveBeenCalledWith([
      expect.objectContaining({
        id: '1',
        completed: true,
      }),
    ]);
  });

  it('should delete a todo', async () => {
    const todos = [new Todo('1', 'Task 1')];
    mockRepository.getTodos.mockResolvedValueOnce(todos);

    await todoUseCases.deleteTodo('1');
    expect(mockRepository.saveTodos).toHaveBeenCalledWith([]);
  });
});
