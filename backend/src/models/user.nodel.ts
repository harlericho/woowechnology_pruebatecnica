// ---- Entidad User ----
export type Role = "user" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  createdat: Date;
  updatedat: Date;
}

// ---- DTOs de Request ----
export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface UpdateProfileDTO {
  name?: string;
}

// ---- DTOs de Response ----
export interface UserPublicDTO {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdat?: Date;
  updatedat?: Date;
}

export interface AuthResponseDTO {
  token: string;
  user: UserPublicDTO;
}

// ---- JWT Payload ----
export interface JwtPayload {
  userId: string;
  email: string;
  role: Role;
}
