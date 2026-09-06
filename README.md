# Catálogo de Películas

Aplicación web para administrar un catálogo de películas. El proyecto está dividido en un backend NestJS y un frontend Vue.

## Proyectos

- `back-nest-peliculas`: API REST desarrollada con NestJS.
- `front-vue-peliculas`: interfaz desarrollada con Vue y Vite.

El backend incluye autenticación JWT, contraseñas protegidas con `bcrypt` y persistencia con Prisma sobre SQLite. La aplicación permite registrar usuarios y administrar películas mediante un CRUD protegido.

## Tecnologías

### Backend

- NestJS
- JWT
- bcrypt
- Prisma 7
- SQLite
- TypeScript

### Frontend

- Vue 3
- Vite
- TypeScript
- Vue Router
- Pinia
- Axios

## Estructura

```text
PPE-Project1/
├── back-nest-peliculas/
├── front-vue-peliculas/
├── PLAN-TALLER-1.md
└── README.md
```

## Requisitos

- Node.js
- npm
- Git

Comprobar las versiones instaladas:

```bash
node --version
npm --version
git --version
```

En Windows PowerShell, si `npm` está bloqueado por la política de ejecución, usar `npm.cmd`.

## Configuración del backend

Abrir una terminal en la raíz y entrar al backend:

```powershell
cd back-nest-peliculas
npm install
```

Crear el archivo `.env` a partir de la plantilla:

```powershell
Copy-Item .env.example .env
```

El archivo `back-nest-peliculas/.env` debe contener:

```env
PORT=3000
JWT_SECRET=local-development-secret-change-before-sharing
JWT_EXPIRES_IN=1d
DATABASE_URL=file:./dev.db
```

`JWT_SECRET` debe ser privado y no debe publicarse en GitHub. El archivo `.env.example` sí debe permanecer en el repositorio.

Iniciar el backend:

```powershell
npm run start:dev
```

La API estará disponible en:

```text
http://localhost:3000
```

## Configuración del frontend

Abrir otra terminal desde la raíz:

```powershell
cd front-vue-peliculas
npm install
```

Crear el archivo `.env` del frontend:

```powershell
Copy-Item .env.example .env
```

El archivo `front-vue-peliculas/.env` debe contener:

```env
VITE_API_URL=http://localhost:3000
```

Iniciar Vue:

```powershell
npm run dev
```

El frontend estará disponible normalmente en:

```text
http://localhost:5173
```

Deben estar ejecutándose las dos aplicaciones al mismo tiempo: NestJS en el puerto `3000` y Vue en el puerto `5173`.

## Usuarios y autenticación

Los usuarios se guardan en SQLite mediante Prisma. El registro crea un hash bcrypt; las contraseñas no se almacenan en texto plano.

En la base local actual existen estos usuarios de desarrollo:

```text
Usuarios: luis, Andres, Wombat
Contraseña: 123456
```

Registrar un usuario nuevo:

```http
POST /auth/register
Content-Type: application/json
```

```json
{
  "username": "nuevo-usuario",
  "password": "123456"
}
```

## Inicio de sesión

El frontend envía las credenciales al endpoint:

```http
POST /auth/login
```

Cuerpo de la petición:

```json
{
  "username": "luis",
  "password": "123456"
}
```

Respuesta exitosa:

```json
{
  "access_token": "jwt-generado-por-nestjs"
}
```

El frontend guarda el token en `localStorage` y lo envía en las siguientes peticiones:

```http
Authorization: Bearer <token>
```

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/auth/login` | Iniciar sesión y recibir un JWT. |
| `POST` | `/auth/register` | Registrar un usuario nuevo. |
| `GET` | `/auth/profile` | Consultar el perfil usando un JWT. |
| `POST` | `/peliculas` | Crear una película usando un JWT. |
| `GET` | `/peliculas` | Listar todas las películas usando un JWT. |
| `GET` | `/peliculas/:id` | Consultar una película usando un JWT. |
| `PATCH` | `/peliculas/:id` | Actualizar una película usando un JWT. |
| `DELETE` | `/peliculas/:id` | Eliminar una película usando un JWT. |

Los endpoints de login y registro son públicos. El perfil y todas las rutas de películas requieren un token válido:

```http
Authorization: Bearer <access_token>
```

Ejemplo para crear una película:

```http
POST http://localhost:3000/peliculas
Content-Type: application/json
Authorization: Bearer <access_token>
```

```json
{
  "title": "Interestelar",
  "director": "Christopher Nolan",
  "cast": "Matthew McConaughey, Anne Hathaway, Jessica Chastain",
  "genre": "Ciencia ficción",
  "ageRating": "PG-13",
  "releaseDate": "2014-11-07",
  "durationMinutes": 169,
  "synopsis": "Un grupo de astronautas viaja a través de un agujero de gusano para encontrar un nuevo hogar para la humanidad.",
  "country": "Estados Unidos",
  "originalLanguage": "Inglés",
  "rating": 8.7,
  "image": "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg"
}
```

## Comandos útiles

### Backend

```powershell
npm run start:dev
npm run build
npm run test
npm run test:e2e
npm run lint
```

### Frontend

```powershell
npm run dev
npm run build
npm run preview
```

## Prisma y SQLite

El esquema de Prisma define los modelos `user` y `Pelicula`. La base local se encuentra en `back-nest-peliculas/dev.db` y usa la URL definida en `DATABASE_URL`.

Para aplicar migraciones y regenerar el cliente después de modificar el esquema:

```powershell
cd back-nest-peliculas
npx prisma migrate dev --name init
npx prisma generate
```

## Próximas funcionalidades

- Implementar búsqueda por título.
- Implementar paginación.
- Completar las operaciones de películas desde Vue.
- Añadir rutas privadas y cierre de sesión completo.

Consulta [PLAN-TALLER-1.md](PLAN-TALLER-1.md) para ver el diagnóstico y el orden detallado de implementación.
