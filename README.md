# Sistema de Gestión de Tareas

Aplicación de gestión de tareas con Next 16, React 19 y Zustand. Incluye autenticación con JWT, CRUD de tareas, arquitectura limpia, estilos con SCSS y pruebas unitarias. El frontend consume el backend vía API Routes y Server Actions de Next.

## Requerimientos

Funcionales:
- Autenticación con formulario y recepción de JWT (almacenado como cookie httpOnly).
- Lista de tareas desde API (título, descripción, estado).
- Creación de tareas con formulario.
- Actualización del estado en formulario de edición.
- Eliminación de tareas con confirmación.

Técnicos:
- Arquitectura limpia y separación de responsabilidades (SOLID).
- Patrones: Ports & Adapters, Repository, Factory/Container.
- Gestión de estado con Zustand.
- Pruebas unitarias con cobertura objetivo >= 70%.
- Integración con backend vía API Routes.
- Instrucciones claras para ejecutar y probar.

## Requisitos

- Node.js 18 o superior
- npm

## Instalación

```bash
npm install
```

## Ejecutar

```bash
npm run dev
```

Abrir `http://localhost:3001`.

Para apuntar al backend local, define `BACKEND_URL` en `frontend/.env.local`:

```bash
BACKEND_URL=https://seek-test-api.onrender.com
```

Si no defines `BACKEND_URL`, se usa `https://seek-test-api.onrender.com` por defecto.

## Cómo iniciar sesión

Las tareas se asocian al usuario autenticado. Credenciales de prueba:

- `user1` / `user1234`
- `user2` / `user1234`
- `user3` / `user1234`

## Pruebas unitarias

```bash
npm run test
npm run test:coverage
```

## Arquitectura

- `src/core`: dominio, puertos y casos de uso
- `src/infra`: implementaciones de API/HTTP/storage
- `src/state`: stores globales con Zustand
- `src/components`: UI reutilizable
- `src/app`: rutas y layout (Next App Router)
- `src/styles`: estilos SCSS organizados por capas

## Patrones y principios

- **Clean Architecture**: el dominio y casos de uso viven en `src/core` y no dependen de infraestructura.
- **Ports & Adapters**: los puertos están en `src/core/ports` y las implementaciones viven en `src/infra`.
- **Dependency Inversion (DIP)**: los casos de uso dependen de interfaces, no de implementaciones concretas.
- **Repository**: `TaskRepository` y `AuthRepository` encapsulan acceso a datos.
- **HTTP Client Port**: `HttpClient` centraliza fetch y manejo de errores.
- **Container / Factory**: `infra/container.ts` centraliza dependencias e inyección por ambiente o tests sin tocar la UI.

Diagrama:

```text
UI (components/app + app router)
        |
      State (zustand stores)
        |
    Use Cases (core/usecases)
        |
    Ports (core/ports)
        |
Infra (api/http/storage)
        |
Backend (API NestJS)
```

Diagrama de carpetas:

```text
frontend/
├── [app] src/app/               -> rutas (App Router), layouts, pages, API routes
├── [ui] src/components/         -> componentes reutilizables
├── [core] src/core/             -> dominio, puertos y casos de uso
├── [infra] src/infra/            -> implementaciones HTTP/API/storage
├── [state] src/state/            -> stores globales (Zustand)
├── [styles] src/styles/          -> SCSS por capas
├── [i18n] src/i18n/              -> internacionalización
├── [theme] src/theme/            -> manejo de temas (light/dark)
├── [tests] __tests__/            -> pruebas unitarias
└── [docs] docs/                  -> documentación generada (JSDoc)
```

## Autenticación

El login se valida en el backend y el token se guarda como cookie httpOnly. El email del usuario se guarda en cookie y localStorage para hidratar la UI.

## API Routes

Las rutas internas viven en `src/app/api` y hacen proxy al backend. Las mutaciones (crear/editar/eliminar) usan Server Actions para mantener el flujo en el servidor.

## Internacionalización

La UI soporta español e inglés. Por defecto se toma el idioma del navegador mediante `Accept-Language`. Puedes cambiarlo desde el menú del header y la preferencia se guarda en la cookie `task_app_locale` para mantener tu selección.

## Temas

El modo claro/oscuro se controla desde el menú de 3 puntos del header. Por defecto se toma el tema del navegador y, cuando eliges uno, se guarda en la cookie `task_app_theme`.

## Scripts

- `dev`: modo desarrollo
- `build`: build de producción
- `start`: iniciar build
- `test`: pruebas unitarias
- `test:coverage`: cobertura
