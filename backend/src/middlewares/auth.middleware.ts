import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt";
import { JwtPayload, Role } from "../models/user.nodel";

// Extender Request para incluir el usuario autenticado
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Token de autenticación requerido" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, jwtConfig.secret) as JwtPayload;
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
};

export const requireRole = (role: Role) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || req.user.role !== role) {
      res
        .status(403)
        .json({ error: "No tienes permiso para realizar esta acción" });
      return;
    }
    next();
  };
};
