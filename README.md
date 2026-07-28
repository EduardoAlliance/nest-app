# Nest App — Full-Stack Auth Skeleton

Base moderna para aplicaciones con autenticación y gestión de usuarios, construida con **React + TypeScript** y diseñada para consumir una API REST (NestJS).

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19 + TypeScript |
| Bundler | Vite 8 |
| Routing | React Router v7 (lazy loading + Suspense) |
| Estado global | Zustand |
| Estado servidor | TanStack React Query |
| Formularios | React Hook Form + Zod (validación) |
| HTTP | Axios |
| Estilos | Tailwind CSS + DaisyUI |
| Notificaciones | react-hot-toast |
| Íconos | Lucide React |

## Lo que demuestra

### Estado global con Zustand
Manejo del estado de autenticación (usuario, tokens, sesión) con persistencia en localStorage y suscripciones parciales para evitar renders innecesarios.

### Data fetching con TanStack React Query
Toda la comunicación con la API se maneja con queries y mutations: caché automática, invalidación inteligente, estados de carga/error y stale time configurado.

### TypeScript fuerte
Tipado completo en toda la aplicación: interfaces genéricas (`ApiResponse<T>`, `PaginatedData<T>`), DTOs tipados, union types para roles y tipos inferidos desde esquemas Zod.

### Manejo de tokens y refresh automático
Interceptor de Axios que adjunta el token en cada request. En caso de 401, refresca el token automáticamente con una cola de requests para evitar race conditions.

### Formularios con validación declarativa
React Hook Form + Zod: esquemas de validación reutilizables, mensajes de error contextuales y contraseña con reglas de seguridad (mayúscula, minúscula, número, especial).

### Enrutamiento lazy
Todas las páginas se cargan con `React.lazy()` y `Suspense` para code splitting. Layouts protegidos que verifican sesión y roles.

### UI responsiva
Sidebar colapsable, tablas con paginación, modales, badges de estado y spinners de carga. Diseñado con Tailwind + DaisyUI.

## Funcionalidades

- **Login / Registro** — con validación y manejo de errores
- **Recuperación de contraseña** — flujo completo (solicitud + restablecimiento con token)
- **Dashboard** — tarjetas con datos del usuario autenticado
- **Perfil** — edición de nombre y email con prellenado
- **Panel admin** — CRUD completo de usuarios con búsqueda, filtros, paginación y soft delete

## Rutas

| Ruta | Descripción |
|------|------------|
| `/login` | Inicio de sesión |
| `/register` | Registro |
| `/forgot-password` | Recuperar contraseña |
| `/reset-password` | Restablecer contraseña (con token) |
| `/dashboard` | Panel principal (autenticado) |
| `/profile` | Editar perfil (autenticado) |
| `/admin/users` | Gestión de usuarios (admin) |

## Scripts

```bash
npm run dev       # Desarrollo
npm run build     # Producción
npm run typecheck # Type checking
npm run lint      # Linter
```

## API esperada

El proyecto consume una API REST en `http://localhost:3000/api/v1` con endpoints de autenticación (`/auth/*`) y usuarios (`/users/*`), devolviendo respuestas con formato `{ success, data, message }` y paginación estándar.

- `POST /auth/login` — Iniciar sesión
- `POST /auth/register` — Registrarse
- `POST /auth/refresh` — Refrescar token
- `POST /auth/logout` — Cerrar sesión
- `POST /auth/forgot-password` — Solicitar restablecimiento
- `POST /auth/reset-password` — Restablecer contraseña
- `POST /auth/verify-email` — Verificar email
- `GET /users/profile` — Obtener perfil
- `PATCH /users/profile` — Actualizar perfil
- `GET /users` — Listar usuarios (paginado, filtrable)
- `GET /users/:id` — Obtener usuario
- `POST /users` — Crear usuario
- `PATCH /users/:id` — Actualizar usuario
- `DELETE /users/:id` — Eliminar usuario (soft delete)
- `POST /users/:id/restore` — Restaurar usuario