export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  userId: string;
  dueDate?: string; // ISO date string
  priority: 'low' | 'medium' | 'high';
}