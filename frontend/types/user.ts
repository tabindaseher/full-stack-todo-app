export interface User {
  id: string;
  email: string;
  name: string;
  jwtToken: string;
  isLoggedIn: boolean;
  tokenExpiry: string; // ISO date string
}