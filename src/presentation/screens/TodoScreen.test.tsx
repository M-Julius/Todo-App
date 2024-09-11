import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import React from 'react';

import { TodoUseCases } from '../../domain/usecases/TodoUseCases';
import TodoScreen from '../screens/TodoScreen';

jest.mock('../../domain/usecases/TodoUseCases');
jest.mock('../../data/repositories/TodoRepository');

describe('TodoScreen', () => {
  let mockGetTodos: jest.Mock;
  let mockAddTodo: jest.Mock;
  let mockDeleteTodo: jest.Mock;
  let mockToggleComplete: jest.Mock;

  beforeEach(() => {
    mockGetTodos = jest.fn();
    mockAddTodo = jest.fn();
    mockDeleteTodo = jest.fn();
    mockToggleComplete = jest.fn();

    (TodoUseCases as jest.Mock).mockImplementation(() => ({
      getTodos: mockGetTodos,
      addTodo: mockAddTodo,
      deleteTodo: mockDeleteTodo,
      toggleComplete: mockToggleComplete,
    }));
  });

  it('should fetch and display todos on initial render', async () => {
    mockGetTodos.mockResolvedValueOnce([
      { id: '1', text: 'Test Task 1', completed: false },
      { id: '2', text: 'Test Task 2', completed: true },
    ]);

    const { getByText } = render(<TodoScreen />);

    await waitFor(() => expect(getByText('Test Task 1')).toBeTruthy());
    expect(getByText('Test Task 2')).toBeTruthy();
  });

  it('should add a new todo when the add button is pressed', async () => {
    mockGetTodos
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ id: '1', text: 'New Task', completed: false }]);

    const { getByPlaceholderText, getByText } = render(<TodoScreen />);

    fireEvent.changeText(getByPlaceholderText('Add a new task'), 'New Task');

    await waitFor(() => act(() => fireEvent.press(getByText('Add'))));

    await waitFor(() => expect(getByText('New Task')).toBeTruthy());
  });

  it('should filter todos based on completed status', async () => {
    // Mock getTodos
    mockGetTodos.mockResolvedValueOnce([
      { id: '1', text: 'Test Task 1', completed: false },
      { id: '2', text: 'Test Task 2', completed: true },
    ]);

    const { getByText } = render(<TodoScreen />);

    await waitFor(() => {
      expect(getByText('Test Task 1')).toBeTruthy();
      expect(getByText('Test Task 2')).toBeTruthy();
    });

    fireEvent.press(getByText('Completed'));

    await waitFor(() => expect(getByText('Test Task 2')).toBeTruthy());
    expect(() => getByText('Test Task 1')).toThrow();
  });

  it('should delete a todo when the delete button is pressed', async () => {
    mockGetTodos
      .mockResolvedValueOnce([{ id: '1', text: 'Task to Delete', completed: false }])
      .mockResolvedValueOnce([]);

    const { getByText, getByTestId } = render(<TodoScreen />);

    await waitFor(() => expect(getByText('Task to Delete')).toBeTruthy());

    await waitFor(() => act(() => fireEvent.press(getByTestId('delete-button-1'))));

    await waitFor(() => expect(() => getByText('Task to Delete')).toThrow());
  });

  it('should toggle todo completion when the checkbox is pressed', async () => {
    mockGetTodos
      .mockResolvedValueOnce([{ id: '1', text: 'Incomplete Task', completed: false }])
      .mockResolvedValueOnce([{ id: '1', text: 'Incomplete Task', completed: true }]);

    const { getByText, getByTestId } = render(<TodoScreen />);

    await waitFor(() => expect(getByText('Incomplete Task')).toBeTruthy());

    await waitFor(() => act(() => fireEvent.press(getByTestId('bouncy-checkbox-1'))));

    await waitFor(() => expect(mockToggleComplete).toHaveBeenCalledWith('1'));
  });
});
