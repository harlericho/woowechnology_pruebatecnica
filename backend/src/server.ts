import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import { errorHandler } from "./middlewares/error.middleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ---- Middlewares globales ----
app.use(cors());
app.use(express.json());

// ---- Rutas ----
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// ---- Health check ----
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ---- Ruta no encontrada ----
app.use((_req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// ---- Manejo global de errores ----
app.use(errorHandler);

// ---- Iniciar servidor ----
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

export default app;
