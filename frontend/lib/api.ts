import { Todo } from '@/types/todo';
import { User } from '@/types/user';

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// Create a base API client with JWT handling
class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Get JWT token from wherever it's stored (localStorage, cookies, etc.)
  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      // In browser environment
      return localStorage.getItem('jwt_token');
    }
    return null;
  }

  // Set up headers with JWT token
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${url}`, error);
      throw error;
    }
  }

  // Authentication methods
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email: string, password: string, name: string): Promise<{ user: User; token: string }> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  // Todo methods
  async getTodos(): Promise<{ success: boolean; todos: Todo[] }> {
    return this.request('/todos');
  }

  async createTodo(todoData: Omit<Todo, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; todo: Todo }> {
    return this.request('/todos', {
      method: 'POST',
      body: JSON.stringify(todoData),
    });
  }

  async updateTodo(id: string, todoData: Partial<Todo>): Promise<{ success: boolean; todo: Todo }> {
    return this.request(`/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(todoData),
    });
  }

  async deleteTodo(id: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/todos/${id}`, {
      method: 'DELETE',
    });
  }

  async getTodosWithFilters(
    status?: 'active' | 'completed' | 'all',
    priority?: 'low' | 'medium' | 'high' | 'all',
    search?: string
  ): Promise<{ success: boolean; todos: Todo[]; filtersApplied: any }> {
    const params = new URLSearchParams();
    if (status && status !== 'all') params.append('status', status);
    if (priority && priority !== 'all') params.append('priority', priority);
    if (search) params.append('search', search);

    const queryString = params.toString();
    const endpoint = queryString ? `/todos?${queryString}` : '/todos';

    return this.request(endpoint);
  }
}

// Create and export the API client instance
export const api = new ApiClient();

// Export types for convenience
export type { Todo, User };