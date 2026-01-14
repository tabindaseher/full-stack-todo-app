/**
 * TodoItem model interface representing an individual todo task
 */

export interface TodoItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string | null; // ISO date string or null
  priority: 'low' | 'medium' | 'high';
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  userId: string; // ID of the user who owns this todo
}

/**
 * Type for creating a new todo item
 */
export interface CreateTodoItemData {
  title: string;
  description?: string;
  dueDate?: string | null;
  priority?: 'low' | 'medium' | 'high';
}

/**
 * Type for updating an existing todo item
 */
export interface UpdateTodoItemData {
  title?: string;
  description?: string;
  completed?: boolean;
  dueDate?: string | null;
  priority?: 'low' | 'medium' | 'high';
}