// Utility functions for JWT token storage and retrieval

/**
 * Store JWT tokens in localStorage
 * @param token - JWT access token
 * @param refreshToken - JWT refresh token (optional)
 */
export const storeTokens = (token: string, refreshToken?: string): void => {
  try {
    localStorage.setItem('token', token);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  } catch (error) {
    console.error('Error storing tokens:', error);
  }
};

/**
 * Retrieve JWT access token from localStorage
 * @returns JWT access token or null if not found
 */
export const getToken = (): string | null => {
  try {
    return localStorage.getItem('token');
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

/**
 * Retrieve JWT refresh token from localStorage
 * @returns JWT refresh token or null if not found
 */
export const getRefreshToken = (): string | null => {
  try {
    return localStorage.getItem('refreshToken');
  } catch (error) {
    console.error('Error retrieving refresh token:', error);
    return null;
  }
};

/**
 * Remove JWT tokens from localStorage
 */
export const removeTokens = (): void => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  } catch (error) {
    console.error('Error removing tokens:', error);
  }
};

/**
 * Check if the user is authenticated
 * @returns true if token exists and is not expired, false otherwise
 */
export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) {
    return false;
  }

  try {
    // Decode the token to check if it's expired
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp > currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return false;
  }
};

/**
 * Get user info from the JWT token
 * @returns user info object or null if token is invalid
 */
export const getUserInfo = (): { id: string; email: string; name: string } | null => {
  const token = getToken();
  if (!token) {
    return null;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
    };
  } catch (error) {
    console.error('Error decoding token for user info:', error);
    return null;
  }
};