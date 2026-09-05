## Why

La plataforma gestiona equipos, torneos y categorías pero no tiene forma de rastrear jugadores individuales. Agregar un módulo de jugadores permite asociar jugadores a equipos y gestionar sus perfiles.

## What Changes

- Nuevo módulo `players` con operaciones CRUD completas (crear, consultar, actualizar, eliminar)
- Entidad Player con atributos: id, name, email, phone, birthday, nationality, imageUrl, imagePublicId, active, createdAt, updatedAt
- Relación bidireccional: Player pertenece a un Team (FK opcional), Team tiene muchos Players
- API REST de `players` siguiendo las convenciones existentes (autenticación, paginación y versionado)

## Capabilities

### New Capabilities

- `player-management`: Operaciones CRUD para jugadores, asociación con equipos, gestión de perfiles

### Modified Capabilities

- `team-management`: La entidad de equipo incorpora la relación con sus jugadores.

## Impact

- Nuevo módulo `players` con su API CRUD
- Modificación del módulo `teams` — la entidad de equipo agrega la relación hacia jugadores
- Registro del módulo `players` en la aplicación
- Nueva migración de base de datos para la tabla `players` con FK hacia `teams`
