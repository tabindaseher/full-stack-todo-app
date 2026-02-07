import axios from 'axios';
import { getToken, getRefreshToken, removeTokens } from '../utils/auth';

// Create axios instance with base configuration
// Initially assume the API prefix based on the backend URL
let apiPrefix = '/api'; // Default for local development
if (process.env.NEXT_PUBLIC_API_BASE_URL) {
  if (process.env.NEXT_PUBLIC_API_BASE_URL.includes('hf.space')) {
    apiPrefix = ''; // No prefix for Hugging Face deployment
  }
}

const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}${apiPrefix}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration and other errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Try to refresh the token
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          let refreshApiPrefix = '/api'; // Default for local development
          if (process.env.NEXT_PUBLIC_API_BASE_URL?.includes('hf.space')) {
            refreshApiPrefix = ''; // No prefix for Hugging Face deployment
          }
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}${refreshApiPrefix}/auth/refresh`, {
            refresh_token: refreshToken
          });

          if (response.data.token) {
            // Store the new tokens (use the existing refresh token since backend doesn't return a new one)
            import('../utils/auth').then(({ storeTokens }) => {
              storeTokens(response.data.token, refreshToken);
            });

            // Retry the original request with the new token
            originalRequest.headers['Authorization'] = `Bearer ${response.data.token}`;
            return axios(originalRequest);
          }
        } catch (refreshError) {
          // If refresh fails, remove tokens and redirect to login
          removeTokens();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token available, remove tokens and redirect to login
        removeTokens();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

// Export specific API functions for authentication
export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),

  register: (name: string, email: string, password: string) =>
    apiClient.post('/auth/register', { name, email, password }),

  logout: () =>
    apiClient.post('/auth/logout'),

  refreshToken: (refreshToken: string) =>
    apiClient.post('/auth/refresh', { refreshToken }),
};

// Export specific API functions for todos
export const todosApi = {
  getAll: (params?: { status?: string; priority?: string; limit?: number; offset?: number }) =>
    apiClient.get('/todos', { params }),

  getById: (id: string) =>
    apiClient.get(`/todos/${id}`),

  create: (data: { title: string; description?: string; dueDate?: string | null; priority?: string }) =>
    apiClient.post('/todos', {
      ...data,
      priority: data.priority || 'medium'  // Ensure priority defaults to 'medium' if not provided
    }),

  update: (id: string, data: { title?: string; description?: string; completed?: boolean; dueDate?: string | null; priority?: string }) =>
    apiClient.put(`/todos/${id}`, {
      ...data,
      priority: data.priority || undefined  // Only send priority if it's provided
    }),

  delete: (id: string) =>
    apiClient.delete(`/todos/${id}`),

  toggleComplete: (id: string, completed: boolean) =>
    apiClient.patch(`/todos/${id}/complete`, { completed }),
};