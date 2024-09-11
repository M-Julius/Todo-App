import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

import assets from '../../../assets';
import { Todo } from '../../domain/entities/Todo';
import colors from '../themes/colors';

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggleComplete, onDelete }) => {
  return (
    <View style={styles.todoItem}>
      <Text
        testID={`todo-text-${todo.id}`}
        style={[styles.todoText, { textDecorationLine: todo.completed ? 'line-through' : 'none' }]}>
        {todo.text}
      </Text>
      <View style={styles.actions}>
        <BouncyCheckbox
          testID={`bouncy-checkbox-${todo.id}`}
          size={25}
          fillColor={colors.primary}
          unFillColor="white"
          innerIconStyle={{ borderWidth: 2 }}
          onPress={() => {
            onToggleComplete(todo.id);
          }}
          id={todo.id}
          isChecked={todo.completed}
        />
        <TouchableOpacity testID={`delete-button-${todo.id}`} onPress={() => onDelete(todo.id)}>
          <Image source={assets.delete} style={styles.deleteButton} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary,
  },
  todoText: {
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
  },
  deleteButton: {
    width: 25,
    height: 25,
  },
});

export default TodoItem;
