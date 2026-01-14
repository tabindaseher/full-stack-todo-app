import { todosApi } from './api';
import { TodoItem, CreateTodoItemData, UpdateTodoItemData } from '../models/todo-item';

/**
 * Service for todo-related operations
 */

interface GetTodosParams {
  status?: 'all' | 'active' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  limit?: number;
  offset?: number;
}

interface GetTodosResponse {
  todos: TodoItem[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * Get all todos for the authenticated user
 */
export const getTodos = async (params?: GetTodosParams): Promise<GetTodosResponse> => {
  try {
    const response = await todosApi.getAll(params);
    const { todos, total, limit, offset } = response.data;

    return { todos, total, limit, offset };
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw error;
  }
};

/**
 * Get a single todo by ID
 */
export const getTodoById = async (id: string): Promise<TodoItem> => {
  try {
    const response = await todosApi.getById(id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching todo with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new todo
 */
export const createTodo = async (data: CreateTodoItemData): Promise<TodoItem> => {
  try {
    const response = await todosApi.create(data);
    return response.data;
  } catch (error) {
    console.error('Error creating todo:', error);
    throw error;
  }
};

/**
 * Update an existing todo
 */
export const updateTodo = async (id: string, data: UpdateTodoItemData): Promise<TodoItem> => {
  try {
    const response = await todosApi.update(id, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating todo with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a todo by ID
 */
export const deleteTodo = async (id: string): Promise<void> => {
  try {
    await todosApi.delete(id);
  } catch (error) {
    console.error(`Error deleting todo with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Toggle the completion status of a todo
 */
export const toggleTodoCompletion = async (id: string, completed: boolean): Promise<TodoItem> => {
  try {
    const response = await todosApi.toggleComplete(id, completed);
    return response.data;
  } catch (error) {
    console.error(`Error toggling completion for todo with ID ${id}:`, error);
    throw error;
  }
};