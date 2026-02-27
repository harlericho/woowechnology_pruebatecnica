import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/user.repository";
import {
  RegisterDTO,
  LoginDTO,
  AuthResponseDTO,
  JwtPayload,
} from "../models/user.nodel";
import { jwtConfig } from "../config/jwt";

const userRepo = new UserRepository();

export class AuthService {
  async register(dto: RegisterDTO): Promise<{ message: string }> {
    // Verificar que el email no esté en uso
    const existing = await userRepo.findByEmail(dto.email);
    if (existing) {
      const error = new Error("El email ya está registrado") as Error & {
        statusCode: number;
      };
      error.statusCode = 400;
      throw error;
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(dto.password, 12);

    await userRepo.create({ ...dto, password: hashedPassword });

    return { message: "Usuario registrado exitosamente" };
  }

  async login(dto: LoginDTO): Promise<AuthResponseDTO> {
    // Buscar usuario
    const user = await userRepo.findByEmail(dto.email);
    if (!user) {
      const error = new Error("Credenciales inválidas") as Error & {
        statusCode: number;
      };
      error.statusCode = 401;
      throw error;
    }

    // Verificar contraseña
    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) {
      const error = new Error("Credenciales inválidas") as Error & {
        statusCode: number;
      };
      error.statusCode = 401;
      throw error;
    }

    // Generar token
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn as string,
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
