export interface User {
  id: number;
  email: string;
  name?: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    email: string;
    name?: string;
    role: string;
    accessToken: string;
    refreshToken: string;
  };
  error?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface RequestResetRequest {
  email: string;
} 