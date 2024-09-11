import { Todo } from './Todo';

describe('Todo Entity', () => {
  it('should create a new todo item', () => {
    const todo = new Todo('1', 'Test Todo');
    expect(todo.id).toBe('1');
    expect(todo.text).toBe('Test Todo');
    expect(todo.completed).toBe(false);
  });

  it('should toggle completion status', () => {
    const todo = new Todo('1', 'Test Todo');
    todo.toggleCompletion();
    expect(todo.completed).toBe(true);
    todo.toggleCompletion();
    expect(todo.completed).toBe(false);
  });
});
