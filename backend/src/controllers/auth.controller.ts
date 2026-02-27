import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { RegisterDTO, LoginDTO } from "../models/user.nodel";

const authService = new AuthService();

export class AuthController {
  async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const dto: RegisterDTO = req.body;
      const result = await authService.register(dto);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: LoginDTO = req.body;
      const result = await authService.login(dto);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
