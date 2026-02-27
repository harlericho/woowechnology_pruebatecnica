import { pool } from "../config/database";
import {
  User,
  RegisterDTO,
  UpdateProfileDTO,
  UserPublicDTO,
} from "../models/user.nodel";

export class UserRepository {
  // Buscar por email (para login y validar unicidad)
  async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query<User>(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );
    return result.rows[0] || null;
  }

  // Buscar por id
  async findById(id: string): Promise<User | null> {
    const result = await pool.query<User>("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    return result.rows[0] || null;
  }

  // Crear usuario
  async create(
    dto: RegisterDTO & { password: string; role?: string },
  ): Promise<UserPublicDTO> {
    const result = await pool.query<UserPublicDTO>(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, createdat, updatedat`,
      [dto.name, dto.email, dto.password, dto.role || "user"],
    );
    return result.rows[0];
  }

  // Actualizar nombre
  async update(
    id: string,
    dto: UpdateProfileDTO,
  ): Promise<UserPublicDTO | null> {
    const result = await pool.query<UserPublicDTO>(
      `UPDATE users SET name = $1, updatedat = NOW()
       WHERE id = $2
       RETURNING id, name, email, role, createdat, updatedat`,
      [dto.name, id],
    );
    return result.rows[0] || null;
  }

  // Listar todos los usuarios (solo admin)
  async findAll(): Promise<UserPublicDTO[]> {
    const result = await pool.query<UserPublicDTO>(
      "SELECT id, name, email, role, createdat, updatedat FROM users ORDER BY createdat DESC",
    );
    return result.rows;
  }
}
