import { authApi } from './api';
import { storeTokens } from '../utils/auth';

/**
 * Service for authentication-related operations
 */

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
}

interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

interface RegisterResponse {
  user: User;
  token: string;
  refreshToken: string;
}

interface LogoutResponse {
  message: string;
}

/**
 * Login user with credentials
 */
export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await authApi.login(credentials.email, credentials.password);
    const { user, token, refreshToken } = response.data;

    // Store tokens locally
    storeTokens(token, refreshToken);

    return { user, token, refreshToken };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Register a new user
 */
export const registerUser = async (userData: RegisterData): Promise<RegisterResponse> => {
  try {
    const response = await authApi.register(userData.name, userData.email, userData.password);
    const { user, token, refreshToken } = response.data;

    // Store tokens locally
    storeTokens(token, refreshToken);

    return { user, token, refreshToken };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Logout the current user
 */
export const logoutUser = async (): Promise<LogoutResponse> => {
  try {
    // Call the logout API to invalidate server-side session
    const response = await authApi.logout();

    // Remove tokens from local storage
    import('../utils/auth').then(({ removeTokens }) => {
      removeTokens();
    });

    return response.data;
  } catch (error) {
    // Even if the API call fails, we should still remove local tokens
    import('../utils/auth').then(({ removeTokens }) => {
      removeTokens();
    });

    console.error('Logout error:', error);
    throw error;
  }
};

/**
 * Refresh the access token using the refresh token
 */
export const refreshToken = async (refreshToken: string): Promise<{ token: string }> => {
  try {
    const response = await authApi.refreshToken(refreshToken);
    const { token } = response.data;

    // Store the new token
    import('../utils/auth').then(({ storeTokens, getRefreshToken }) => {
      const refreshToken = getRefreshToken();
      storeTokens(token, refreshToken || undefined);
    });

    return { token };
  } catch (error) {
    console.error('Token refresh error:', error);
    throw error;
  }
};