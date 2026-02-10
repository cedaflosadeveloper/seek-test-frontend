# Sistema de Gestion de Tareas

Aplicacion de gestion de tareas con Next 16, React 19 y Zustand. Incluye autenticacion con JWT, CRUD de tareas, arquitectura limpia, estilos con SCSS y pruebas unitarias. El frontend consume el backend via API Routes y Server Actions de Next.

## Requerimientos

Funcionales:
- Autenticacion con formulario y recepcion de JWT (almacenado como cookie httpOnly).
- Lista de tareas desde API (titulo, descripcion, estado).
- Creacion de tareas con formulario.
- Actualizacion del estado en formulario de edicion.
- Eliminacion de tareas con confirmacion.

Tecnicos:
- Arquitectura limpia y separacion de responsabilidades (SOLID).
- Patrones: Ports & Adapters, Repository, Factory/Container.
- Gestion de estado con Zustand.
- Pruebas unitarias con cobertura objetivo >= 70%.
- Integracion con backend via API Routes.
- Instrucciones claras para ejecutar y probar.

## Requisitos

- Node.js 18 o superior
- npm

## Instalacion

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

## Como loguearse

Las tareas se asocian al usuario autenticado. Credenciales de prueba:

- `user1` / `user1234`
- `user2` / `user1234`
- `user3` / `user1234`

## Pruebas

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

## Autenticacion

El login se valida en el backend y el token se guarda como cookie httpOnly. El email del usuario se guarda en cookie y localStorage para hidratar la UI.

## API Routes

Las rutas internas viven en `src/app/api` y hacen proxy al backend. Las mutaciones (crear/editar/eliminar) usan Server Actions para mantener el flujo en el servidor.

## Internacionalizacion

La UI soporta español e ingles. Puedes alternar el idioma desde el switch del header. La preferencia se guarda en la cookie `task_app_locale` y, si no existe, se detecta con `Accept-Language`.

## Scripts

- `dev`: modo desarrollo
- `build`: build de produccion
- `start`: iniciar build
- `test`: pruebas unitarias
- `test:coverage`: cobertura
