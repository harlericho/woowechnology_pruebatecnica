import { UserRepository } from "../repositories/user.repository";
import { UpdateProfileDTO, UserPublicDTO } from "../models/user.nodel";

const userRepo = new UserRepository();

export class UserService {
  async getProfile(userId: string): Promise<UserPublicDTO> {
    const user = await userRepo.findById(userId);
    if (!user) {
      const error = new Error("Usuario no encontrado") as Error & {
        statusCode: number;
      };
      error.statusCode = 404;
      throw error;
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdat: user.createdat,
      updatedat: user.updatedat,
    };
  }

  async updateProfile(
    userId: string,
    dto: UpdateProfileDTO,
  ): Promise<{ message: string; user: UserPublicDTO }> {
    const updated = await userRepo.update(userId, dto);
    if (!updated) {
      const error = new Error("Usuario no encontrado") as Error & {
        statusCode: number;
      };
      error.statusCode = 404;
      throw error;
    }
    return { message: "Perfil actualizado", user: updated };
  }

  async getAllUsers(): Promise<{ users: UserPublicDTO[] }> {
    const users = await userRepo.findAll();
    return { users };
  }
}
