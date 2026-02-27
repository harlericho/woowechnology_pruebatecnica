import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import {
  validateRegister,
  validateLogin,
} from "../middlewares/validation.middleware";

const router = Router();
const authController = new AuthController();

// POST /api/auth/register
router.post(
  "/register",
  validateRegister,
  authController.register.bind(authController),
);

// POST /api/auth/login
router.post("/login", validateLogin, authController.login.bind(authController));

export default router;
