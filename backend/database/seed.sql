-- Seed para la tabla de usuarios , registro de pruebas
INSERT INTO users (name, email, password, role) VALUES
(
  'Admin WoowTech',
  'admin@woow.com',
  '$2b$12$mgIjaJzFi2cjlswySfmtJulsdcYuGOFE3Uu9SgL.YftWMvuSBFw3G',
  'admin'
),
(
  'Carlos Choca Sanchez',
  'karloxavier_chs@hotmail.com',
  '$2b$12$NmlXkTf5ftdc5dvuxbeURudlC5bFYg5HtIGzNcoHMY5NxqMmnnBya',
  'user'
)
ON CONFLICT (email) DO NOTHING;

-- Credenciales de prueba:
-- Admin: admin@woow.com / admin123456
-- User:  karloxavier_chs@hotmail.com / user12345678
