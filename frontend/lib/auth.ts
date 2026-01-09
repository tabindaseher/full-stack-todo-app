// Authentication utilities for the frontend application

// Function to get JWT token from storage
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    // In browser environment
    return localStorage.getItem('jwt_token');
  }
  return null;
};

// Function to set JWT token in storage
export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    // In browser environment
    localStorage.setItem('jwt_token', token);
  }
};

// Function to remove JWT token from storage
export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    // In browser environment
    localStorage.removeItem('jwt_token');
  }
};

// Function to get user data from storage
export const getUserData = (): any => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }
  return null;
};

// Function to set user data in storage
export const setUserData = (userData: any): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user_data', JSON.stringify(userData));
  }
};

// Function to remove user data from storage
export const removeUserData = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user_data');
  }
};

// Function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  const userData = getUserData();

  if (!token || !userData) {
    return false;
  }

  // Check if token is expired
  if (userData.tokenExpiry) {
    const expiryDate = new Date(userData.tokenExpiry);
    const now = new Date();
    if (now > expiryDate) {
      // Token expired, remove it
      removeAuthToken();
      removeUserData();
      return false;
    }
  }

  return true;
};

// Function to logout user
export const logout = (): void => {
  removeAuthToken();
  removeUserData();
};

// Function to decode JWT token (without validation)
export const decodeToken = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Function to check if token will expire soon (within 1 hour)
export const isTokenExpiringSoon = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return false;
  }

  const expTime = decoded.exp * 1000; // Convert to milliseconds
  const now = Date.now();
  const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds

  return expTime - now < oneHour;
};

// Function to refresh token (in a real app, you'd call your backend)
export const refreshToken = async (): Promise<string | null> => {
  // In a real implementation, you would call your backend to refresh the token
  // This is just a placeholder
  console.warn('Token refresh not implemented in this example');
  return null;
};

// API functions for authentication
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

interface SignInCredentials {
  email: string;
  password: string;
}

interface SignUpData {
  email: string;
  password: string;
  name: string;
}

interface AuthResponse {
  success: boolean;
  user?: any;
  token?: string;
  message?: string;
}

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    // Check if the response is JSON before trying to parse it
    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // If not JSON, try to get text response and create a proper error object
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        // If text is not valid JSON either, create a generic error
        // Use the status text as message if available, otherwise default message
        data = { message: response.statusText || 'Login failed' };
      }
    }

    // If the response status indicates an error, use the data to construct the response
    if (!response.ok) {
      return {
        success: false,
        message: data.message || `Login failed with status ${response.status}`,
      };
    }

    return {
      success: true,
      user: data.user,
      token: data.token,
    };
  } catch (error) {
    console.error('Sign in error:', error);
    return {
      success: false,
      message: 'Network error. Please try again.',
    };
  }
}

export async function signUp(email: string, password: string, name: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    });

    // Check if the response is JSON before trying to parse it
    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // If not JSON, try to get text response and create a proper error object
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        // If text is not valid JSON either, create a generic error
        // Use the status text as message if available, otherwise default message
        data = { message: response.statusText || 'Registration failed' };
      }
    }

    // If the response status indicates an error, use the data to construct the response
    if (!response.ok) {
      return {
        success: false,
        message: data.message || `Registration failed with status ${response.status}`,
      };
    }

    return {
      success: true,
      user: data.user,
      token: data.token,
    };
  } catch (error) {
    console.error('Sign up error:', error);
    return {
      success: false,
      message: 'Network error. Please try again.',
    };
  }
}