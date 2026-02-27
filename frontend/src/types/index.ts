export type Role = "user" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdat?: string;
  updatedat?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface UpdateProfileDTO {
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  error: string;
  detalles?: string[];
}
