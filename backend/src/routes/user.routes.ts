import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticate, requireRole } from "../middlewares/auth.middleware";
import { validateUpdateProfile } from "../middlewares/validation.middleware";

const router = Router();
const userController = new UserController();

// GET /api/users/me - perfil del usuario autenticado
router.get("/me", authenticate, userController.getMe.bind(userController));

// PUT /api/users/me - actualizar perfil
router.put(
  "/me",
  authenticate,
  validateUpdateProfile,
  userController.updateMe.bind(userController),
);

// GET /api/users - listar todos (solo admin)
router.get(
  "/",
  authenticate,
  requireRole("admin"),
  userController.getAllUsers.bind(userController),
);

export default router;
