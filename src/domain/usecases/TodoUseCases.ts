import { TodoRepository } from '../../data/repositories/TodoRepository';
import { Todo } from '../entities/Todo';

export class TodoUseCases {
  private todoRepository: TodoRepository;

  constructor(todoRepository: TodoRepository) {
    this.todoRepository = todoRepository;
  }

  async getTodos(): Promise<Todo[]> {
    return await this.todoRepository.getTodos();
  }

  async addTodo(text: string): Promise<void> {
    const newTodo = new Todo(Date.now().toString(), text);
    const todos = await this.todoRepository.getTodos();
    todos.push(newTodo);
    await this.todoRepository.saveTodos(todos);
  }

  async deleteTodo(id: string): Promise<void> {
    const todos = await this.todoRepository.getTodos();
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    await this.todoRepository.saveTodos(updatedTodos);
  }

  async toggleComplete(id: string): Promise<void> {
    const todos = await this.todoRepository.getTodos();
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        todo.toggleCompletion();
      }
      return todo;
    });
    await this.todoRepository.saveTodos(updatedTodos);
  }
}
