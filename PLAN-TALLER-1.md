# Taller #1: plan de trabajo

## 1. Estado actual del repositorio

### Rama

- Rama actual detectada: `andres`.
- Repositorio raíz: `PPE-Project1`.

### Estructura encontrada

```text
PPE-Project1/
├── back-nest-peliculas/
│   ├── src/
│   │   ├── auth/
│   │   ├── public/
│   │   └── users/
│   ├── package.json
│   └── README.md
└── .git/
```

### Avances confirmados

- Existe un proyecto NestJS funcional como base.
- Existe `AuthModule`, `AuthController`, `AuthService` y un `AuthGuard`.
- Está instalada la dependencia `@nestjs/jwt`.
- El guard ya lee `Authorization: Bearer <token>` y valida el JWT.
- Existe una ruta de ejemplo `POST /auth/login` y una ruta protegida `GET /auth/profile`.
- Hay un módulo `UsersModule`, pero actualmente los usuarios están definidos en un arreglo dentro de `UsersService`.

### Faltantes o incompletos

| Requisito | Estado | Qué falta |
|---|---|---|
| Modelo del tema con id, nombre e imagen | Pendiente | Elegir el dominio y crear el modelo Prisma. |
| CRUD REST completo | Pendiente | Crear módulo, controller, service y DTOs del recurso. |
| Prisma 7 + SQLite | Pendiente | Instalar/configurar Prisma, `schema.prisma`, migración y servicio Prisma. |
| Proyecto Vue | Pendiente | Crear el frontend y conectarlo a la API. |
| Búsqueda por nombre | Pendiente | Filtro en API y control en Vue. |
| Paginación | Pendiente | Parámetros `page` y `limit` en API y controles en Vue. |
| Registro de usuarios | Pendiente | DTO, endpoint y persistencia en base de datos. |
| Contraseñas hasheadas | Pendiente | Usar `bcrypt` o `argon2`; actualmente se comparan contraseñas en texto plano. |
| Login completo | Parcial | Firma JWT, pero usa usuarios en memoria y secreto escrito en el código. |
| Protección de escritura | Parcial | Existe un guard global, pero hay que declarar públicas las rutas de lectura y registro. |
| Sesión en Vue | Pendiente | Guardar token, interceptor/header, navegación privada y logout. |
| `.env.example` y README | Pendiente | Documentar variables, instalación, migraciones y ejecución de ambos proyectos. |

## 2. Decisión del dominio

Usaremos **películas** como tema del proyecto. El recurso principal será `Movie`:

```text
Movie
├── id               Integer, autoincremental
├── title            String
├── description      String
├── ageRating        String
├── durationMinutes  Integer
├── originalLanguage String
├── cast             String
├── image            String
├── releaseDate      DateTime opcional
├── createdAt DateTime
└── updatedAt DateTime
```

El nombre debe ser único. La imagen puede ser inicialmente una URL para mantener el alcance del taller controlado.

## 3. Orden recomendado de implementación

### Fase 1: preparar el backend

Desde `back-nest-peliculas/`:

```bash
npm install @prisma/client bcrypt class-validator class-transformer
npm install -D prisma @types/bcrypt
npx prisma init --datasource-provider sqlite
```

Crear un secreto JWT y la URL de SQLite en `.env`:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="cambiar-por-un-secreto-largo-y-privado"
JWT_EXPIRES_IN="1d"
PORT=3000
```

Crear `.env.example` con las mismas variables, pero sin secretos reales.

### Fase 2: definir Prisma y crear la base de datos

En `prisma/schema.prisma` se deben definir al menos estos modelos:

```prisma
model User {
  id           Int      @id @default(autoincrement())
  username     String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Movie {
  id               Int      @id @default(autoincrement())
  title            String   @unique
  description      String
  ageRating        String
  durationMinutes  Int
  originalLanguage String
  cast             String
  image            String
  releaseDate      DateTime?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}
```

Ejecutar:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

Crear `PrismaService` y `PrismaModule`, exportar el servicio y registrarlo en `AppModule`.

## 2.1 Diseño recomendado de la base de datos

Para este taller conviene comenzar con un diseño pequeño y sólido. Las tablas obligatorias son `User` y `Movie`; las tablas `Genre`, `Actor` y `MovieActor` pueden agregarse después si el equipo quiere demostrar relaciones entre entidades.

### Tabla `User` — obligatoria

| Columna | Tipo | Reglas | Propósito |
|---|---|---|---|
| `id` | `Int` | PK, autoincremental | Identificador del usuario. |
| `username` | `String` | Único, no nulo | Nombre usado para registrarse e iniciar sesión. |
| `email` | `String` | Único, opcional o requerido | Permite identificar al usuario y ampliar el login en el futuro. |
| `passwordHash` | `String` | No nulo | Contraseña hasheada; nunca guardar `password` en texto plano. |
| `role` | `String` o enum | Por defecto `USER` | Permite distinguir usuarios normales y administradores si se necesita. |
| `createdAt` | `DateTime` | Valor automático | Fecha de registro. |
| `updatedAt` | `DateTime` | Actualización automática | Fecha del último cambio. |

Para mantener el taller sencillo, `username`, `passwordHash`, `createdAt` y `updatedAt` son suficientes. `email` y `role` son recomendados, pero no deben retrasar el CRUD.

### Tabla `Movie` — obligatoria

| Columna | Tipo | Reglas | Propósito |
|---|---|---|---|
| `id` | `Int` | PK, autoincremental | Identificador de la película. |
| `title` | `String` | No nulo | Título que se muestra y por el que se busca. |
| `description` | `String` | No nulo | Sinopsis de la película. |
| `ageRating` | `String` | No nulo | Clasificación de edad. |
| `durationMinutes` | `Int` | Positivo | Duración en minutos. |
| `originalLanguage` | `String` | No nulo | Idioma original. |
| `cast` | `String` | No nulo | Reparto inicial como texto separado por comas. |
| `image` | `String` | No nulo | URL del póster o imagen. |
| `releaseDate` | `DateTime` | Opcional | Fecha de estreno. |
| `createdAt` | `DateTime` | Valor automático | Fecha de creación. |
| `updatedAt` | `DateTime` | Actualización automática | Fecha de la última edición. |

El requisito mínimo se cumple con `id`, `title` e `image`. Los demás campos permiten un CRUD de películas más completo sin crear demasiadas tablas.

### Tablas `Genre`, `Actor` y `MovieActor` — opcionales

Solo conviene agregarlas si necesitan más variedad de datos o quieren demostrar una relación `N:M`:

| Columna | Tipo | Reglas | Propósito |
|---|---|---|---|
| `id` | `Int` | PK, autoincremental | Identificador del género o actor. |
| `name` | `String` | Único, no nulo | Nombre del género o actor. |
| `createdAt` | `DateTime` | Valor automático | Fecha de creación. |

`MovieActor` tendría `movieId` y `actorId` como claves foráneas. No es necesario crear un CRUD completo de estas tablas para cumplir el taller; pueden cargarse como datos iniciales o dejarse para una segunda fase.

### Modelo Prisma recomendado

Esta versión mantiene solo las tablas necesarias y deja los campos ampliados listos para el frontend:

```prisma
model User {
  id           Int      @id @default(autoincrement())
  username     String   @unique
  email        String?  @unique
  passwordHash String
  role         String   @default("USER")
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Movie {
  id               Int      @id @default(autoincrement())
  title            String
  description      String
  ageRating        String
  durationMinutes  Int
  originalLanguage String
  cast             String
  image            String
  releaseDate      DateTime?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  @@index([title])
}
```

### Decisiones importantes

- No crear una tabla para sesiones o tokens: el JWT se valida sin guardar la sesión en SQLite.
- No guardar contraseñas originales; solo `passwordHash` generado con `bcrypt` o `argon2`.
- No guardar imágenes binarias en SQLite para este taller; guardar una URL en `image` es suficiente.
- Usar `@unique` en `username` y `title` evita duplicados desde la base de datos, además de validarlos en el service.
- Mantener `createdAt` y `updatedAt` facilita ordenar, auditar cambios y mostrar información útil.
- Agregar índices solamente cuando exista una consulta real que lo necesite; para este alcance, los campos únicos ya tienen índices.

### Qué debe probarse con la base de datos

- Dos usuarios no pueden registrarse con el mismo `username`.
- Dos películas no pueden tener el mismo `title`.
- El login funciona después de reiniciar el servidor, porque los usuarios están persistidos.
- La contraseña almacenada no coincide con la enviada por el usuario.
- Las películas permanecen después de reiniciar NestJS.
- La búsqueda y la paginación consultan SQLite, no un arreglo temporal.

### Fase 3: implementar el CRUD NestJS

Generar el recurso solicitado por el taller:

```bash
npx nest g resource movies
```

Elegir REST API y generar CRUD. Adaptar los archivos generados:

- `movies.module.ts`: importar `PrismaModule`.
- `movies.service.ts`: implementar `create`, `findAll`, `findOne`, `update` y `remove` con Prisma.
- `movies.controller.ts`: exponer los endpoints.
- `dto/create-movie.dto.ts`: validar título, descripción, clasificación, duración, idioma, reparto e imagen.
- `dto/update-movie.dto.ts`: reutilizar el DTO de creación como parcial.

Endpoints esperados:

| Método | Ruta | Acceso | Uso |
|---|---|---|---|
| `GET` | `/movies?page=1&limit=10&search=matrix` | Público | Listar, buscar por título y paginar. |
| `GET` | `/movies/:id` | Público | Consultar una película. |
| `POST` | `/movies` | JWT | Crear. |
| `PATCH` | `/movies/:id` | JWT | Editar. |
| `DELETE` | `/movies/:id` | JWT | Eliminar. |

Para `findAll`, calcular `skip = (page - 1) * limit`, filtrar por `title` con búsqueda insensible a mayúsculas y devolver:

```json
{
  "data": [],
  "meta": { "page": 1, "limit": 10, "total": 0, "totalPages": 0 }
}
```

Activar `ValidationPipe` global en `main.ts` con `whitelist` y `transform`.

### Fase 4: terminar autenticación JWT

1. Crear `RegisterDto` y `LoginDto` con validaciones.
2. Agregar `POST /auth/register`.
3. Buscar usuarios en Prisma, nunca en un arreglo en memoria.
4. Hashear la contraseña con `bcrypt.hash(password, 10)`.
5. En login, comparar con `bcrypt.compare(password, passwordHash)`.
6. Leer `JWT_SECRET` y `JWT_EXPIRES_IN` desde `ConfigModule`/`.env`.
7. Mantener el JWT en el formato `{ sub: user.id, username: user.username }`.
8. Marcar como públicas las rutas de registro, login y consultas `GET`.
9. Dejar protegidos `POST`, `PATCH` y `DELETE` de `movies`.
10. No devolver `passwordHash` en ninguna respuesta.

Pruebas mínimas de API:

```text
POST /auth/register     -> 201
POST /auth/login        -> 200 + access_token
GET  /movies            -> 200 sin token
POST /movies            -> 401 sin token, 201 con token
PATCH /movies/:id       -> 401 sin token, 200 con token
DELETE /movies/:id      -> 401 sin token, 204 con token
```

### Fase 5: crear el proyecto Vue

Desde la raíz del repositorio:

```bash
npm create vue@latest front-vue-peliculas
```

Seleccionar Vue 3, TypeScript, Vue Router y Pinia. Después:

```bash
cd front-vue-peliculas
npm install
npm install axios
```

Estructura sugerida:

```text
src/
├── api/axios.ts
├── stores/auth.ts
├── router/index.ts
├── views/LoginView.vue
├── views/RegisterView.vue
├── views/MoviesView.vue
└── components/MovieForm.vue
```

### Fase 6: implementar sesión y rutas privadas en Vue

1. En el store de autenticación, guardar `access_token` en `localStorage`.
2. Configurar Axios para enviar `Authorization: Bearer <token>` automáticamente.
3. Crear formularios de registro e inicio de sesión.
4. Después del login, guardar el token y redirigir a `/movies`.
5. Crear un `router.beforeEach` que envíe a `/login` si una ruta requiere sesión y no hay token.
6. Añadir botón de logout que borre el token y redirija a `/login`.
7. Mostrar el formulario de creación y los botones de edición/eliminación solo para usuarios autenticados.

### Fase 7: construir el CRUD en la interfaz

En `MoviesView.vue`:

- Cargar `GET /movies` al entrar.
- Enviar `search`, `page` y `limit` como query params.
- Mostrar título, póster, descripción, clasificación, duración, idioma y reparto.
- Añadir búsqueda con debounce o botón de búsqueda.
- Añadir botones anterior/siguiente y mostrar la página actual.
- Abrir el formulario para crear o editar.
- Confirmar antes de eliminar.
- Actualizar la tabla/listado después de cada operación.
- Mostrar estados de carga, errores y lista vacía.

## 4. README y entrega

El README final debe incluir:

1. Descripción del proyecto y del tema.
2. Requisitos: Node.js, npm y Git.
3. Instalación del backend y frontend.
4. Copia de `.env.example` a `.env`.
5. Comandos de migración Prisma.
6. Comandos para ejecutar ambos proyectos.
7. URL de la API y del frontend.
8. Usuarios de prueba o pasos para registrarse.
9. Tabla de endpoints.
10. Integrantes y enlace al repositorio público.

Comandos de verificación antes de entregar:

```bash
# Backend
npm run build
npm run lint
npm run test

# Frontend
npm run build
```

## 5. Checklist de aceptación

- [ ] El repositorio contiene `back-nest-peliculas` y `front-vue-peliculas`.
- [ ] Prisma usa SQLite y existe una migración reproducible.
- [ ] `Movie` tiene `id`, `title` e `image`, además de los campos cinematográficos.
- [ ] Las cuatro operaciones del CRUD funcionan desde Vue.
- [ ] La lista busca por nombre y pagina resultados.
- [ ] El registro guarda una contraseña hasheada.
- [ ] El login devuelve un JWT firmado desde una variable de entorno.
- [ ] Crear, editar y eliminar requieren JWT.
- [ ] Vue persiste el token, envía el header y protege rutas.
- [ ] Logout elimina la sesión.
- [ ] Existe `.env.example` sin secretos reales.
- [ ] README permite levantar ambos proyectos desde cero.
- [ ] Se probó la demostración: registro, login, listar, crear, editar y eliminar.

## 6. Prioridad inmediata

El siguiente bloque de trabajo debe ser:

1. Crear la configuración Prisma/SQLite.
2. Crear `PrismaService` y migrar `User` y `Movie`.
3. Reemplazar los usuarios en memoria por Prisma.
4. Generar e implementar `movies`.
5. Probar la API antes de crear la interfaz Vue.

Hasta completar ese bloque, el proyecto no cumple todavía el CRUD ni la persistencia exigida por el taller.