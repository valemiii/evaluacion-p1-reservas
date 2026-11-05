# API de reservas de canchas · Evaluación P1

## Requisitos

- Node.js
- Docker
- npm

## Cómo levantar el proyecto

1. Copia la plantilla:

   ```sh
   cp .env-example .env
   ```

   Cambia `30XX` por `3020` en `.env`; el resto de valores de la plantilla se usan tal cual con la base de Docker.

2. Instala las dependencias:

   ```sh
   npm install
   ```

3. Levanta PostgreSQL:

   ```sh
   docker compose up -d
   ```

4. Aplica las migraciones:

   ```sh
   npx prisma migrate deploy
   ```

5. Genera el cliente de Prisma:

   ```sh
   npx prisma generate
   ```

6. Carga los datos iniciales:

   ```sh
   npx prisma db seed
   ```

7. Inicia la API:

   ```sh
   npm start
   ```

Con `PORT=3020`, la API queda disponible en `http://localhost:3020`.

## Variables de entorno

| Variable | Uso |
|---|---|
| `PORT` | Puerto donde escucha la API. |
| `NODE_ENV` | Entorno de ejecución; en `development`, los errores incluyen el stack. |
| `JWT_SECRET` | Secreto usado para firmar y verificar los tokens JWT. Debe ser un valor privado y fuerte. |
| `DATABASE_URL` | URL de conexión de Prisma a PostgreSQL. |

## Usuarios del seed

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | `paulo.galarza@example.com` | `admin123` |
| Estudiante | `vnguaiguacundo@espe.edu.ec` | `admin` |

## Endpoints

Las rutas tienen el prefijo `/api`. Los endpoints protegidos requieren un token JWT en la cabecera HTTP `Authorization`.

| Método | Ruta | Rol | Body | Respuestas |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | Público | `name`, `email`, `password` | `201`, `400` |
| `POST` | `/api/auth/login` | Público | `email`, `password` | `200`, `400` |
| `GET` | `/api/auth/protected-route` | Autenticado | — | `200`, `401`, `403` |
| `POST` | `/api/admin/schedules` | Administrador | `court`, `startTime`, `endTime` | `201`, `400`, `401`, `403`, `500` |
| `GET` | `/api/admin/bookings` | Administrador | — | `200`, `401`, `403`, `500` |
| `POST` | `/api/bookings` | Usuario autenticado | `date`, `scheduleId` | `201`, `400`, `401`, `403`, `500` |
| `GET` | `/api/bookings/:id` | Propietario de la reserva o administrador | — | `200`, `400`, `401`, `403`, `404`, `500` |
| `PUT` | `/api/bookings/:id` | Propietario de la reserva o administrador | `date`, `scheduleId` | `200`, `400`, `401`, `403`, `404`, `500` |
| `DELETE` | `/api/bookings/:id` | Propietario de la reserva o administrador | — | `204`, `400`, `401`, `403`, `404`, `500` |
| `GET` | `/api/users/:id/bookings` | Propietario del usuario o administrador | — | `200`, `400`, `401`, `403`, `500` |

`500` corresponde a errores inesperados propagados al middleware global. Las rutas administrativas responden `403` cuando el usuario autenticado no tiene rol de administrador; las rutas de reservas y usuarios también validan permisos y existencia según corresponda.

## Postman

En Postman, importa `postman/EVAL_P1_Guaiguacundo.postman_collection.json` como colección e importa `postman/EVAL_P1_local.postman_environment.json` como entorno. Selecciona el entorno `EVAL_P1_local` y configura como variables locales de la colección `adminPassword` con `admin123` y `userPassword` con `admin`.
