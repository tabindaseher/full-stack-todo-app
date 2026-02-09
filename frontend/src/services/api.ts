import axios from 'axios';
import { getToken, getRefreshToken, removeTokens } from '../utils/auth';

// Create axios instance with base configuration
// Determine if we need the /api prefix based on the backend deployment
// For Hugging Face Spaces, routes are mounted at root; for other deployments, they're under /api
const isHfSpace = process.env.NEXT_PUBLIC_API_BASE_URL?.includes('hf.space') || false;
const apiPrefix = isHfSpace ? '' : '/api';
const baseURL = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}${apiPrefix}`;

console.log('🔧 API Configuration:');
console.log('  - NEXT_PUBLIC_API_BASE_URL:', process.env.NEXT_PUBLIC_API_BASE_URL);
console.log('  - Is HF Space:', isHfSpace);
console.log('  - API Prefix:', apiPrefix);
console.log('  - Final Base URL:', baseURL);

const apiClient = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    console.log('🔐 Request interceptor:');
    console.log('  - URL:', config.url);
    console.log('  - Full URL:', (config.baseURL || '') + (config.url || ''));
    console.log('  - Token exists:', !!token);
    console.log('  - Token preview:', token ? token.substring(0, 20) + '...' : 'No token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
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
          // Use the same base URL as the main client with appropriate prefix
          const isHfSpace = process.env.NEXT_PUBLIC_API_BASE_URL?.includes('hf.space') || false;
          const apiPrefix = isHfSpace ? '' : '/api';
          const refreshBaseURL = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}${apiPrefix}`;
          
          const response = await axios.post(`${refreshBaseURL}/auth/refresh`, {
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

// Export specific API functions for tasks
export const tasksApi = {
  getAll: (userId: string, params?: { status?: string; priority?: string; limit?: number; offset?: number }) => {
    console.log('🔍 tasksApi.getAll - Request details:');
    console.log('  - userId:', userId);
    console.log('  - params:', params);
    console.log('  - full URL:', `${apiClient.defaults.baseURL}/${userId}/tasks`);
    return apiClient.get(`/${userId}/tasks`, { params });
  },

  getById: (userId: string, id: string) => {
    console.log('🔍 tasksApi.getById - Request details:');
    console.log('  - userId:', userId);
    console.log('  - taskId:', id);
    console.log('  - full URL:', `${apiClient.defaults.baseURL}/${userId}/tasks/${id}`);
    return apiClient.get(`/${userId}/tasks/${id}`);
  },

  create: (userId: string, data: { title: string; description?: string }) => {
    console.log('🔍 tasksApi.create - Request details:');
    console.log('  - userId:', userId);
    console.log('  - data:', data);
    console.log('  - full URL:', `${apiClient.defaults.baseURL}/${userId}/tasks`);
    return apiClient.post(`/${userId}/tasks`, data);
  },

  update: (userId: string, id: string, data: { title?: string; description?: string; completed?: boolean }) => {
    console.log('🔍 tasksApi.update - Request details:');
    console.log('  - userId:', userId);
    console.log('  - taskId:', id);
    console.log('  - data:', data);
    console.log('  - full URL:', `${apiClient.defaults.baseURL}/${userId}/tasks/${id}`);
    return apiClient.put(`/${userId}/tasks/${id}`, data);
  },

  delete: (userId: string, id: string) => {
    console.log('🔍 tasksApi.delete - Request details:');
    console.log('  - userId:', userId);
    console.log('  - taskId:', id);
    console.log('  - full URL:', `${apiClient.defaults.baseURL}/${userId}/tasks/${id}`);
    return apiClient.delete(`/${userId}/tasks/${id}`);
  },

  toggleComplete: (userId: string, id: string, completed: boolean) => {
    console.log('🔍 tasksApi.toggleComplete - Request details:');
    console.log('  - userId:', userId);
    console.log('  - taskId:', id);
    console.log('  - completed:', completed);
    console.log('  - full URL:', `${apiClient.defaults.baseURL}/${userId}/tasks/${id}/complete`);
    return apiClient.patch(`/${userId}/tasks/${id}/complete`, { completed });
  },
};