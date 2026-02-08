import { tasksApi } from './api';
import { TodoItem, CreateTodoItemData, UpdateTodoItemData } from '../models/todo-item';
import { getUser } from '../utils/auth';

/**
 * Service for task-related operations
 */

interface GetTasksParams {
  status?: 'all' | 'active' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  limit?: number;
  offset?: number;
}

interface GetTasksResponse {
  tasks: TodoItem[];
  total: number;
  limit: number;
  offset: number;
}

interface GetTodosResponse {
  todos: TodoItem[];
  total: number;
  limit: number;
  offset: number;
}

interface GetTodosParams {
  status?: 'all' | 'active' | 'completed';
  limit?: number;
  offset?: number;
}

/**
 * Get all tasks for the authenticated user
 */
export const getTasks = async (params?: GetTasksParams): Promise<GetTasksResponse> => {
  try {
    const user = getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    console.log('🔍 getTasks called with params:', params);
    console.log('🔍 API endpoint:', tasksApi);
    console.log('🔍 Current user ID:', user.id);

    const response = await tasksApi.getAll(user.id, params);

    console.log('✅ Raw API response:', response);
    console.log('✅ Response data:', response.data);

    // Handle different response formats - the API returns either:
    // 1. An array directly (current backend format)
    // 2. An object with tasks property (expected format)
    let tasks: TodoItem[] = [];
    let total = 0;
    let limit = 100;
    let offset = 0;

    if (Array.isArray(response.data)) {
      console.log('📦 Response is array format');
      // Direct array response from backend - need to map fields from snake_case to camelCase
      tasks = response.data.map((task: any) => ({
        id: String(task.id),
        title: task.title || '',
        description: task.description,
        completed: task.completed || false,
        dueDate: task.due_date || null, // Map due_date to dueDate
        priority: task.priority || 'medium',
        createdAt: task.created_at || new Date().toISOString(), // Map created_at to createdAt
        updatedAt: task.updated_at || new Date().toISOString(), // Map updated_at to updatedAt
        userId: task.user_id || '', // Map user_id to userId
      }));
      total = response.data.length;
    } else if (response.data && typeof response.data === 'object') {
      console.log('📦 Response is object format');
      // Object response with tasks property
      const responseTasks = response.data.tasks || [];
      tasks = responseTasks.map((task: any) => ({
        id: String(task.id),
        title: task.title || '',
        description: task.description,
        completed: task.completed || false,
        dueDate: task.due_date || null, // Map due_date to dueDate
        priority: task.priority || 'medium',
        createdAt: task.created_at || new Date().toISOString(), // Map created_at to createdAt
        updatedAt: task.updated_at || new Date().toISOString(), // Map updated_at to updatedAt
        userId: task.user_id || '', // Map user_id to userId
      }));
      total = response.data.total || responseTasks.length || 0;
      limit = response.data.limit || 100;
      offset = response.data.offset || 0;
    }

    console.log('✅ Processed tasks:', tasks);
    return { tasks, todos: tasks, total, limit, offset }; // Return both tasks and todos for backward compatibility
  } catch (error: any) {
    console.error('❌ Error fetching tasks:', error);
    console.error('❌ Error response:', error?.response);
    console.error('❌ Error message:', error?.message);
    throw error;
  }
};

/**
 * Get a single task by ID
 */
export const getTaskById = async (id: string): Promise<TodoItem> => {
  try {
    const user = getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const response = await tasksApi.getById(user.id, id);

    // Map response fields from snake_case to camelCase
    const task = response.data;
    return {
      id: String(task.id),
      title: task.title || '',
      description: task.description,
      completed: task.completed || false,
      dueDate: task.due_date || null, // Map due_date to dueDate
      priority: task.priority || 'medium',
      createdAt: task.created_at || new Date().toISOString(), // Map created_at to createdAt
      updatedAt: task.updated_at || new Date().toISOString(), // Map updated_at to updatedAt
      userId: task.user_id || '', // Map user_id to userId
    };
  } catch (error) {
    console.error(`Error fetching task with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new task
 */
export const createTask = async (data: CreateTodoItemData): Promise<TodoItem> => {
  try {
    const user = getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Only send title and description as per spec
    const requestData = {
      title: data.title,
      description: data.description
    };
    
    const response = await tasksApi.create(user.id, requestData);

    // Map response fields from snake_case to camelCase
    const task = response.data;
    return {
      id: String(task.id),
      title: task.title || '',
      description: task.description,
      completed: task.completed || false,
      dueDate: task.due_date || null, // Map due_date to dueDate
      priority: task.priority || 'medium',
      createdAt: task.created_at || new Date().toISOString(), // Map created_at to createdAt
      updatedAt: task.updated_at || new Date().toISOString(), // Map updated_at to updatedAt
      userId: task.user_id || '', // Map user_id to userId
    };
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

/**
 * Update an existing task
 */
export const updateTask = async (id: string, data: UpdateTodoItemData): Promise<TodoItem> => {
  try {
    const user = getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Only send allowed fields as per spec
    const requestData: any = {};
    if (data.title !== undefined) requestData.title = data.title;
    if (data.description !== undefined) requestData.description = data.description;
    if (data.completed !== undefined) requestData.completed = data.completed;
    
    const response = await tasksApi.update(user.id, id, requestData);

    // Map response fields from snake_case to camelCase
    const task = response.data;
    return {
      id: String(task.id),
      title: task.title || '',
      description: task.description,
      completed: task.completed || false,
      dueDate: task.due_date || null, // Map due_date to dueDate
      priority: task.priority || 'medium',
      createdAt: task.created_at || new Date().toISOString(), // Map created_at to createdAt
      updatedAt: task.updated_at || new Date().toISOString(), // Map updated_at to updatedAt
      userId: task.user_id || '', // Map user_id to userId
    };
  } catch (error) {
    console.error(`Error updating task with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a task by ID
 */
export const deleteTask = async (id: string): Promise<void> => {
  try {
    const user = getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    await tasksApi.delete(user.id, id);
  } catch (error) {
    console.error(`Error deleting task with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Toggle the completion status of a task
 */
export const toggleTaskCompletion = async (id: string, completed: boolean): Promise<TodoItem> => {
  try {
    const user = getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const response = await tasksApi.toggleComplete(user.id, id, completed);

    // Map response fields from snake_case to camelCase
    const task = response.data;
    return {
      id: String(task.id),
      title: task.title || '',
      description: task.description,
      completed: task.completed || false,
      dueDate: task.due_date || null, // Map due_date to dueDate
      priority: task.priority || 'medium',
      createdAt: task.created_at || new Date().toISOString(), // Map created_at to createdAt
      updatedAt: task.updated_at || new Date().toISOString(), // Map updated_at to updatedAt
      userId: task.user_id || '', // Map user_id to userId
    };
  } catch (error) {
    console.error(`Error toggling completion for task with ID ${id}:`, error);
    throw error;
  }
};

// Export the old function names for backward compatibility with proper typing
export const getTodos = async (params?: GetTodosParams): Promise<GetTodosResponse> => {
  const result = await getTasks(params);
  return {
    todos: result.tasks,  // Map tasks to todos for backward compatibility
    total: result.total,
    limit: result.limit,
    offset: result.offset
  };
};

export const getTodoById = getTaskById;
export const createTodo = createTask;
export const updateTodo = updateTask;
export const deleteTodo = deleteTask;
export const toggleTodoCompletion = toggleTaskCompletion;