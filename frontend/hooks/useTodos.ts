import { useState, useEffect } from 'react';
import { Todo } from '@/types/todo';
import { api } from '@/lib/api';

interface UseTodosReturn {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  addTodo: (todo: Omit<Todo, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTodo: (id: string, updates: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  refreshTodos: () => Promise<void>;
}

const useTodos = (): UseTodosReturn => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getTodos();
      setTodos(response.todos);
    } catch (err) {
      console.error('Error loading todos:', err);
      setError('Failed to load todos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const addTodo = async (todoData: Omit<Todo, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await api.createTodo(todoData);
      setTodos([response.todo, ...todos]);
    } catch (err) {
      console.error('Error adding todo:', err);
      setError('Failed to add todo');
      throw err;
    }
  };

  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    try {
      const response = await api.updateTodo(id, updates);
      setTodos(todos.map(todo => todo.id === id ? response.todo : todo));
    } catch (err) {
      console.error('Error updating todo:', err);
      setError('Failed to update todo');
      throw err;
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await api.deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      console.error('Error deleting todo:', err);
      setError('Failed to delete todo');
      throw err;
    }
  };

  const refreshTodos = async () => {
    await loadTodos();
  };

  return {
    todos,
    loading,
    error,
    addTodo,
    updateTodo,
    deleteTodo,
    refreshTodos,
  };
};

export default useTodos;