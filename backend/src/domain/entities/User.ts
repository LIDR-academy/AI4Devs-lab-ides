export interface User {
  id: number;
  email: string;
  password: string;
  name: string | null;
}

export interface UserCreationParams {
  email: string;
  password: string;
  name: string | null;
} 