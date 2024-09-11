import AsyncStorage from '@react-native-async-storage/async-storage';

import { Todo } from '../../domain/entities/Todo';

export class TodoRepository {
  private static STORAGE_KEY = 'todos';

  async getTodos(): Promise<Todo[]> {
    try {
      const storedTodos = await AsyncStorage.getItem(TodoRepository.STORAGE_KEY);
      const todos = storedTodos ? JSON.parse(storedTodos) : [];

      return todos.map((todo: Todo) => new Todo(todo.id, todo.text, todo.completed));
    } catch (error) {
      console.error('Failed to load todos:', error);
      return [];
    }
  }

  async saveTodos(todos: Todo[]): Promise<void> {
    try {
      await AsyncStorage.setItem(TodoRepository.STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error('Failed to save todos:', error);
    }
  }
}
