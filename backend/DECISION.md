# Documento de Decisiones Técnicas

## ¿Por qué estas librerías?

- **Express.js**: Framework minimalista y maduro. Ofrece flexibilidad total para estructurar el proyecto con la arquitectura deseada (controllers, services, repositories).
- **bcryptjs**: Estándar de la industria para hashear contraseñas. Salt rounds en 12 para balance entre seguridad y rendimiento.
- **jsonwebtoken**: Librería oficial y más usada para JWT en Node.js. Simple y bien documentada.
- **express-validator**: Integración nativa con Express para validaciones declarativas y legibles.
- **pg (node-postgres)**: Driver oficial de PostgreSQL para Node.js. Permite queries con prepared statements para prevenir SQL injection.

## Decisiones de arquitectura

- **Separación de capas**: Controller → Service → Repository. Cada capa tiene una única responsabilidad, facilitando el testing y el mantenimiento.
- **Prepared statements**: Todas las queries usan parámetros posicionales (`$1, $2`) en lugar de concatenación de strings, eliminando el riesgo de SQL injection.
- **Passwords nunca expuestos**: El campo `password` nunca se incluye en los DTOs de respuesta. Las queries de solo lectura (findAll, update) no lo seleccionan.
- **UUID como primary key**: Más seguro que IDs numéricos secuenciales (no expone cantidad de usuarios).

## Desafíos encontrados

- Extender el tipo `Request` de Express para incluir el usuario autenticado requiere declaración global de namespace.
- El manejo centralizado de errores con `statusCode` personalizado requiere un tipo extendido de `Error`.

## ¿Qué mejoraría con más tiempo?

- Agregar refresh tokens para mayor seguridad.
- Rate limiting en endpoints de auth (evitar fuerza bruta).
- Logs estructurados con Winston.
- Tests unitarios e integración con Jest y supertest.
- Paginacion en GET /api/users.
- Docker Compose para levantar todo con un comando.
- Migraciones de DB con una herramienta dedicada (node-pg-migrate).

## ¿Cómo escalaría esta solución?

- **Horizontal**: El uso de JWT stateless permite escalar múltiples instancias sin compartir sesiones
- **Base de datos**: Connection pooling ya configurado con `pg.Pool`. Para escala mayor: replicas de lectura y PgBouncer
