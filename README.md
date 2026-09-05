# Catálogo de Películas

Aplicación web para administrar un catálogo de películas. El proyecto está dividido en un backend NestJS y un frontend Vue.

## Proyectos

- `back-nest-peliculas`: API REST desarrollada con NestJS.
- `front-vue-peliculas`: interfaz desarrollada con Vue y Vite.

Actualmente el backend incluye autenticación JWT y comparación de contraseñas mediante `bcrypt`. Los usuarios son provisionales y todavía están definidos en memoria. La persistencia con Prisma y SQLite queda como el siguiente bloque de implementación.

## Tecnologías

### Backend

- NestJS
- JWT
- bcrypt
- Prisma 7, pendiente de completar
- SQLite, pendiente de completar
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

## Usuarios provisionales

Actualmente los usuarios están definidos en memoria dentro de `UsersService`. Todavía no se crean desde un formulario ni se guardan en SQLite.

### Usuario 1

```text
Usuario: john
Contraseña: changeme
```

### Usuario 2

```text
Usuario: maria
Contraseña: guess
```

Las contraseñas se comparan utilizando `bcrypt.compare()` contra un `passwordHash`. No se guardan las contraseñas originales en texto plano.

Estos usuarios son temporales. Al implementar Prisma y SQLite, deberán reemplazarse por registros persistidos en la tabla `User`.

## Inicio de sesión

El frontend envía las credenciales al endpoint:

```http
POST /auth/login
```

Cuerpo de la petición:

```json
{
  "username": "john",
  "password": "changeme"
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

## Endpoints actuales

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/auth/login` | Iniciar sesión y recibir un JWT. |
| `GET` | `/auth/profile` | Consultar el perfil usando un JWT. |

El endpoint de login es público. El endpoint de perfil requiere un token válido.

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

Prisma debe instalarse dentro de `back-nest-peliculas`, nunca en la carpeta general ni en el frontend:

```powershell
cd back-nest-peliculas
npm install prisma@7 @prisma/client@7
npx prisma init --datasource-provider sqlite
```

Después de crear `prisma/schema.prisma` y definir los modelos:

```powershell
npx prisma migrate dev --name init
npx prisma generate
```

La base de datos SQLite quedará en el backend, según la ruta definida en `DATABASE_URL`.

## Próximas funcionalidades

- Crear el modelo `Movie` con título, descripción, clasificación de edad, duración, idioma, reparto e imagen.
- Persistir usuarios en SQLite mediante Prisma.
- Crear el registro de usuarios.
- Hashear contraseñas nuevas con `bcrypt.hash(password, 10)`.
- Implementar el CRUD completo de películas.
- Implementar búsqueda por título.
- Implementar paginación.
- Completar las operaciones de películas desde Vue.
- Añadir rutas privadas y cierre de sesión completo.

Consulta [PLAN-TALLER-1.md](PLAN-TALLER-1.md) para ver el diagnóstico y el orden detallado de implementación.
