import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import React from 'react';

import TodoItem from './TodoItem';
import { Todo } from '../../domain/entities/Todo';

describe('TodoItem', () => {
  const todo = new Todo('1', 'Test Task', false);
  const onToggleComplete = jest.fn();
  const onDelete = jest.fn();

  it('should display todo text', () => {
    const { getByText } = render(
      <TodoItem todo={todo} onToggleComplete={onToggleComplete} onDelete={onDelete} />
    );
    expect(getByText('Test Task')).toBeTruthy();
  });

  it('should render the checkbox with the correct state based on todo.completed', async () => {
    const { getByText } = render(
      <TodoItem todo={todo} onToggleComplete={onToggleComplete} onDelete={onDelete} />
    );

    const todoText = getByText('Test Task');

    waitFor(async () => {
      await act(() => {
        expect(todoText.props.style[1].textDecorationLine).toBe('none');
      });
    });
    const completedTodo = { ...todo, completed: true } as Todo;
    const { getByText: getCompletedText } = render(
      <TodoItem todo={completedTodo} onToggleComplete={onToggleComplete} onDelete={onDelete} />
    );

    const completedTodoText = getCompletedText('Test Task');
    waitFor(async () => {
      await act(() => {
        expect(completedTodoText.props.style[1].textDecorationLine).toBe('line-through');
      });
    });
  });

  it('should call onToggleComplete when the checkbox is pressed', async () => {
    const { getByTestId } = render(
      <TodoItem todo={todo} onToggleComplete={onToggleComplete} onDelete={onDelete} />
    );
    const checkbox = getByTestId(`bouncy-checkbox-${todo.id}`);

    await act(async () => {
      fireEvent.press(checkbox);
    });

    expect(onToggleComplete).toHaveBeenCalledWith('1');
  });

  it('should call onDelete when the delete button is pressed', async () => {
    const { getByTestId } = render(
      <TodoItem todo={todo} onToggleComplete={onToggleComplete} onDelete={onDelete} />
    );
    const deleteButton = getByTestId(`delete-button-${todo.id}`);

    await act(async () => {
      fireEvent.press(deleteButton);
    });

    expect(onDelete).toHaveBeenCalledWith('1');
  });
});
