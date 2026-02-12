import axios from 'axios';
import { getToken, getRefreshToken, removeTokens } from '../utils/auth';

// API Service - Dynamic environment handling
// Create axios instance with base configuration
const baseURL = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}`;

// Determine if we're in production (Hugging Face Space) environment
const isProduction = typeof window !== 'undefined' && 
  (window.location.hostname.includes('.hf.space') || 
   process.env.NEXT_PUBLIC_API_BASE_URL?.includes('.hf.space'));

console.log('🔧 API Configuration:');
console.log('  - NEXT_PUBLIC_API_BASE_URL:', process.env.NEXT_PUBLIC_API_BASE_URL);
console.log('  - Final Base URL:', baseURL);
console.log('  - Is Production (HF Space):', isProduction);

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
          // Use the same base URL as the main client - determine route based on environment
          const refreshBaseURL = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}`;
          
          // Determine if we're in production (HF Space) environment for refresh endpoint
          const isProd = typeof window !== 'undefined' && 
            (window.location.hostname.includes('.hf.space') || 
             process.env.NEXT_PUBLIC_API_BASE_URL?.includes('.hf.space'));
             
          const refreshEndpoint = isProd ? '/auth/refresh' : '/api/auth/refresh';

          const response = await axios.post(`${refreshBaseURL}${refreshEndpoint}`, {
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
  login: (email: string, password: string) => {
    const endpoint = isProduction ? '/auth/login' : '/api/auth/login';
    return apiClient.post(endpoint, { email, password });
  },

  register: (name: string, email: string, password: string) => {
    const endpoint = isProduction ? '/auth/register' : '/api/auth/register';
    return apiClient.post(endpoint, { name, email, password });
  },

  logout: () => {
    const endpoint = isProduction ? '/auth/logout' : '/api/auth/logout';
    return apiClient.post(endpoint);
  },

  refreshToken: (refreshToken: string) => {
    const endpoint = isProduction ? '/auth/refresh' : '/api/auth/refresh';
    return apiClient.post(endpoint, { refreshToken });
  },
};

// Export specific API functions for tasks
const getTasksEndpoint = (userId: string, endpoint: string) => {
  const prefix = isProduction ? '' : '/api';
  return `${prefix}/${userId}/tasks${endpoint}`;
};

export const tasksApi = {
  getAll: (userId: string, params?: { status?: string; priority?: string; limit?: number; offset?: number }) => {
    console.log('🔍 tasksApi.getAll - Request details:');
    console.log('  - userId:', userId);
    console.log('  - params:', params);
    const endpoint = getTasksEndpoint(userId, '');
    console.log('  - full URL:', `${apiClient.defaults.baseURL}${endpoint}`);
    return apiClient.get(endpoint, { params });
  },

  getById: (userId: string, id: string) => {
    console.log('🔍 tasksApi.getById - Request details:');
    console.log('  - userId:', userId);
    console.log('  - taskId:', id);
    const endpoint = getTasksEndpoint(userId, `/${id}`);
    console.log('  - full URL:', `${apiClient.defaults.baseURL}${endpoint}`);
    return apiClient.get(endpoint);
  },

  create: (userId: string, data: { title: string; description?: string }) => {
    console.log('🔍 tasksApi.create - Request details:');
    console.log('  - userId:', userId);
    console.log('  - data:', data);
    const endpoint = getTasksEndpoint(userId, '');
    console.log('  - full URL:', `${apiClient.defaults.baseURL}${endpoint}`);
    return apiClient.post(endpoint, data);
  },

  update: (userId: string, id: string, data: { title?: string; description?: string; completed?: boolean }) => {
    console.log('🔍 tasksApi.update - Request details:');
    console.log('  - userId:', userId);
    console.log('  - taskId:', id);
    console.log('  - data:', data);
    const endpoint = getTasksEndpoint(userId, `/${id}`);
    console.log('  - full URL:', `${apiClient.defaults.baseURL}${endpoint}`);
    return apiClient.put(endpoint, data);
  },

  delete: (userId: string, id: string) => {
    console.log('🔍 tasksApi.delete - Request details:');
    console.log('  - userId:', userId);
    console.log('  - taskId:', id);
    const endpoint = getTasksEndpoint(userId, `/${id}`);
    console.log('  - full URL:', `${apiClient.defaults.baseURL}${endpoint}`);
    return apiClient.delete(endpoint);
  },

  toggleComplete: (userId: string, id: string, completed: boolean) => {
    console.log('🔍 tasksApi.toggleComplete - Request details:');
    console.log('  - userId:', userId);
    console.log('  - taskId:', id);
    console.log('  - completed:', completed);
    const endpoint = getTasksEndpoint(userId, `/${id}/complete`);
    console.log('  - full URL:', `${apiClient.defaults.baseURL}${endpoint}`);
    return apiClient.patch(endpoint, { completed });
  },
};