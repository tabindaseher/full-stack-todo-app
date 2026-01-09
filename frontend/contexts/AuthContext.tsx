'use client';

import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { User } from '@/types/user';
import { getAuthToken, getUserData, removeAuthToken, removeUserData } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const token = getAuthToken();
    const userData = getUserData();

    if (token && userData) {
      try {
        // Check if token is still valid (not expired)
        if (isTokenValid(userData.tokenExpiry)) {
          setUser({
            ...userData,
            jwtToken: token,
            isLoggedIn: true
          });
        } else {
          // Token expired, clear storage
          removeAuthToken();
          removeUserData();
        }
      } catch (err) {
        console.error('Error parsing user data:', err);
        removeAuthToken();
        removeUserData();
      }
    }
    setLoading(false);
  }, []);

  const isTokenValid = (expiry: string): boolean => {
    if (!expiry) return true; // If no expiry, assume valid
    const expiryDate = new Date(expiry);
    const now = new Date();
    return expiryDate > now;
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      // Call the actual API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid credentials');
      }

      if (data.success && data.token) {
        // Store token and user data in localStorage
        localStorage.setItem('jwt_token', data.token);
        localStorage.setItem('user_data', JSON.stringify(data.user));

        setUser({
          ...data.user,
          jwtToken: data.token,
          isLoggedIn: true,
        });
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid credentials. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      setError(null);

      // Call the actual API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      if (data.success && data.token) {
        // Store token and user data in localStorage
        localStorage.setItem('jwt_token', data.token);
        localStorage.setItem('user_data', JSON.stringify(data.user));

        setUser({
          ...data.user,
          jwtToken: data.token,
          isLoggedIn: true,
        });
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeAuthToken();
    removeUserData();
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user && user.isLoggedIn,
    login,
    register,
    logout,
    error,
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