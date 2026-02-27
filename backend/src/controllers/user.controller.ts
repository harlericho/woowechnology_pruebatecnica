import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import { UpdateProfileDTO } from "../models/user.nodel";

const userService = new UserService();

export class UserController {
  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const user = await userService.getProfile(userId);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async updateMe(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const dto: UpdateProfileDTO = req.body;
      const result = await userService.updateProfile(userId, dto);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await userService.getAllUsers();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
