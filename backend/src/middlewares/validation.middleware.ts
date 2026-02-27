import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

// Middleware para capturar errores de validación
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: "Datos inválidos",
      detalles: errors.array().map((e) => e.msg),
    });
    return;
  }
  next();
};

// Reglas para registro
export const validateRegister = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre es requerido")
    .isLength({ min: 2 })
    .withMessage("El nombre debe tener al menos 2 caracteres"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("El email es requerido")
    .isEmail()
    .withMessage("El email no es válido")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("La contraseña es requerida")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener mínimo 8 caracteres"),
  handleValidationErrors,
];

// Reglas para login
export const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("El email es requerido")
    .isEmail()
    .withMessage("El email no es válido")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("La contraseña es requerida"),
  handleValidationErrors,
];

// Reglas para actualizar perfil
export const validateUpdateProfile = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre es requerido")
    .isLength({ min: 2 })
    .withMessage("El nombre debe tener al menos 2 caracteres"),
  handleValidationErrors,
];
