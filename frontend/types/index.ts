// This file can contain general type definitions
// Specific types are in their respective files

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}