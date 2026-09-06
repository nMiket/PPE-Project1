# Catálogo de Películas

Aplicación web para administrar un catálogo de películas. El proyecto está dividido en un backend NestJS y un frontend Vue.

## Puesta en marcha desde GitHub

Estos son los pasos para ejecutar el proyecto después de descargarlo o clonarlo desde GitHub.

### 1. Clonar el repositorio

Requisitos previos: Node.js, npm y Git instalados.

```powershell
git clone https://github.com/nMiket/PPE-Project1.git
cd PPE-Project1
```

En Windows PowerShell, si `npm` está bloqueado por la política de ejecución, usar `npm.cmd` en los comandos siguientes.

### 2. Preparar el backend

En una terminal, desde la raíz del proyecto:

```powershell
cd back-nest-peliculas
npm install
npx prisma generate
Copy-Item .env.example .env
```

Revisar `back-nest-peliculas/.env` y mantener, como mínimo, esta configuración local:

```env
PORT=3000
JWT_SECRET=local-development-secret-change-before-sharing
JWT_EXPIRES_IN=1d
DATABASE_URL=file:./dev.db
```

`JWT_SECRET` debe cambiarse por un valor privado en cualquier entorno compartido o de producción. Para preparar una base de datos nueva usando las migraciones:

```powershell
npx prisma migrate deploy
```

Iniciar el backend y dejar esta terminal abierta:

```powershell
npm run start:dev
```

La API quedará disponible en `http://localhost:3000`.

### 3. Preparar el frontend

Abrir una segunda terminal desde la raíz del repositorio:

```powershell
cd front-vue-peliculas
npm install
Copy-Item .env.example .env
```

Confirmar que `front-vue-peliculas/.env` tenga la URL del backend:

```env
VITE_API_URL=http://localhost:3000
```

Iniciar Vue:

```powershell
npm run dev
```

Abrir la URL que muestre Vite, normalmente `http://localhost:5173`. El backend y el frontend deben permanecer ejecutándose al mismo tiempo.

### 4. Primer uso

1. Abrir `/register` o seleccionar el enlace de registro desde el login.
2. Crear un usuario con contraseña y confirmación de contraseña.
3. Iniciar sesión.
4. Consultar, crear, editar y eliminar películas desde el catálogo.

Para comprobar que todo está listo antes de ejecutar la aplicación, se pueden construir ambos proyectos:

```powershell
# Desde back-nest-peliculas
npm run build

# Desde front-vue-peliculas
npm run build
```

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

Desde el login se puede abrir la pantalla de registro. El formulario solicita usuario, contraseña y confirmación de contraseña antes de llamar a `POST /auth/register`. La confirmación se valida en el frontend y el hash de la contraseña se genera en el backend.

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

## Frontend

El frontend consume la API mediante Axios. Después del login guarda el JWT en `localStorage` y lo añade automáticamente como encabezado `Authorization` en las peticiones protegidas.

La vista de películas permite:

- Listar las películas obtenidas desde `GET /peliculas`.
- Crear, editar y eliminar películas mediante los endpoints correspondientes.
- Ver el detalle de cada película.
- Filtrar por título, género, director, idioma, país, clasificación y rango de calificación.
- Paginar los resultados en bloques de seis películas.

Los filtros se ejecutan actualmente en el frontend sobre el catálogo cargado. Los valores separados por comas se convierten en opciones individuales, se eliminan duplicados ignorando mayúsculas y acentos, y se limpian signos `?` y espacios inconsistentes provenientes de la base de datos.

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

- Mover los filtros y la paginación al backend si el catálogo crece considerablemente.
- Añadir validaciones DTO más estrictas para las peticiones de películas.
- Configurar variables y secretos específicos para producción.

Consulta [PLAN-TALLER-1.md](PLAN-TALLER-1.md) para ver el diagnóstico y el orden detallado de implementación.
