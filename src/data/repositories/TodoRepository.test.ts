import AsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

import { TodoRepository } from './TodoRepository';
import { Todo } from '../../domain/entities/Todo';

describe('TodoRepository', () => {
  let todoRepository: TodoRepository;

  beforeEach(() => {
    todoRepository = new TodoRepository();
    AsyncStorage.clear();
  });

  it('should retrieve todos from AsyncStorage', async () => {
    const todos = [new Todo('1', 'Test Todo')];
    await AsyncStorage.setItem('todos', JSON.stringify(todos));

    const result = await todoRepository.getTodos();
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: '1',
          text: 'Test Todo',
          completed: false,
        }),
      ])
    );
  });

  it('should save todos to AsyncStorage', async () => {
    const todos = [new Todo('1', 'New Task')];
    await todoRepository.saveTodos(todos);

    const storedTodos = await AsyncStorage.getItem('todos');
    expect(JSON.parse(storedTodos || '')).toEqual(
      expect.arrayContaining([expect.objectContaining({ text: 'New Task' })])
    );
  });
});
