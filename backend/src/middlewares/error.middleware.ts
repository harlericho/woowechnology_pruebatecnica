import { Request, Response, NextFunction } from "express";

interface AppError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const statusCode = err.statusCode || 500;
  const message =
    statusCode === 500 ? "Error interno del servidor" : err.message;

  if (statusCode === 500) {
    console.error("Error no controlado:", err);
  }

  res.status(statusCode).json({ error: message });
};
