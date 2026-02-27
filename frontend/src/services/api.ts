import axios from "axios";
import type {
  LoginDTO,
  RegisterDTO,
  UpdateProfileDTO,
  AuthResponse,
  User,
} from "../types";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// Interceptor: agrega el token en cada request automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: si el token expira, limpia la sesión
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// ---- Auth ----
export const authService = {
  register: async (dto: RegisterDTO): Promise<{ message: string }> => {
    const res = await api.post("/auth/register", dto);
    return res.data;
  },

  login: async (dto: LoginDTO): Promise<AuthResponse> => {
    const res = await api.post("/auth/login", dto);
    return res.data;
  },
};

// ---- Users ----
export const userService = {
  getMe: async (): Promise<User> => {
    const res = await api.get("/users/me");
    return res.data;
  },

  updateMe: async (
    dto: UpdateProfileDTO,
  ): Promise<{ message: string; user: User }> => {
    const res = await api.put("/users/me", dto);
    return res.data;
  },

  getAll: async (): Promise<{ users: User[] }> => {
    const res = await api.get("/users");
    return res.data;
  },
};
