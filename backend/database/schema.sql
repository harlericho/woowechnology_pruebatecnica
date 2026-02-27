
-- CREATE DATABASE woow_db;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(10) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  createdat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedat TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indice para búsquedas por email
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
