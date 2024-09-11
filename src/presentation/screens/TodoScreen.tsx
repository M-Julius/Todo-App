import React, { useState, useEffect, useMemo } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
} from 'react-native';

import { TodoRepository } from '../../data/repositories/TodoRepository';
import { Todo } from '../../domain/entities/Todo';
import { TodoUseCases } from '../../domain/usecases/TodoUseCases';
import TodoItem from '../components/TodoItem';
import colors from '../themes/colors';

const TodoScreen: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'uncompleted'>('all');

  const todoUseCases = new TodoUseCases(new TodoRepository());

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      if (filter === 'completed') {
        return todo.completed;
      } else if (filter === 'uncompleted') {
        return !todo.completed;
      }
      return true; // 'all'
    });
  }, [todos, filter]);

  useEffect(() => {
    const fetchTodos = async () => {
      const todos = await todoUseCases.getTodos();
      setTodos(todos);
    };

    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    if (input.trim()) {
      await todoUseCases.addTodo(input);
      const todos = await todoUseCases.getTodos();
      setTodos(todos);
      setInput('');
    }
  };

  const handleDeleteTodo = async (id: string) => {
    await todoUseCases.deleteTodo(id);
    const todos = await todoUseCases.getTodos();
    setTodos(todos);
  };

  const handleToggleComplete = async (id: string) => {
    await todoUseCases.toggleComplete(id);
    const todos = await todoUseCases.getTodos();
    setTodos(todos);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Todo App</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a new task"
          value={input}
          onChangeText={(text) => setInput(text)}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddTodo}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.filterContainer}>
        <TouchableOpacity onPress={() => setFilter('all')}>
          <Text style={[styles.filterButton, filter === 'all' && styles.activeFilter]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter('completed')}>
          <Text style={[styles.filterButton, filter === 'completed' && styles.activeFilter]}>
            Completed
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter('uncompleted')}>
          <Text style={[styles.filterButton, filter === 'uncompleted' && styles.activeFilter]}>
            Uncompleted
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredTodos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TodoItem
            todo={item}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDeleteTodo}
          />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: StatusBar.currentHeight,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.secondary,
    paddingLeft: 15,
    borderRadius: 30,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  filterButton: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  activeFilter: {
    color: colors.primary,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default TodoScreen;
