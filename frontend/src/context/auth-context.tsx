import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../services/api';
import { storeTokens, removeTokens, isAuthenticated, getUserInfo } from '../utils/auth';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication status on initial load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const currentAuthStatus = isAuthenticated(); // This is the imported function from utils/auth
      setAuthStatus(currentAuthStatus); // This is the state setter function

      if (currentAuthStatus) {
        const userInfo = getUserInfo();
        if (userInfo) {
          setUser(userInfo);
          setToken(localStorage.getItem('token'));
          setRefreshToken(localStorage.getItem('refreshToken'));
        }
      }
      setIsLoading(false);
    } catch (err) {
      console.error('Error checking auth status:', err);
      setIsLoading(false);
      setAuthStatus(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.login(email, password);

      const { user: userData, token: accessToken, refreshToken: refreshTokenValue } = response.data;

      storeTokens(accessToken, refreshTokenValue);

      setUser(userData);
      setToken(accessToken);
      setRefreshToken(refreshTokenValue);
      setAuthStatus(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.register(name, email, password);

      const { user: userData, token: accessToken, refreshToken: refreshTokenValue } = response.data;

      storeTokens(accessToken, refreshTokenValue);

      setUser(userData);
      setToken(accessToken);
      setRefreshToken(refreshTokenValue);
      setAuthStatus(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);

    try {
      // Call logout API to invalidate server-side session if needed
      await authApi.logout().catch(() => {
        // If logout API fails, continue with local logout
        console.warn('Logout API call failed, proceeding with local logout');
      });
    } catch (err) {
      console.error('Error during logout API call:', err);
      // Continue with local logout even if API call fails
    } finally {
      // Clear local storage and state
      removeTokens();
      setUser(null);
      setToken(null);
      setRefreshToken(null);
      setAuthStatus(false);
      setIsLoading(false);
    }
  };

  const value = {
    user,
    token,
    refreshToken,
    isAuthenticated: authStatus,
    isLoading,
    error,
    login,
    register,
    logout,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};