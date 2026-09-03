## Why

La plataforma gestiona equipos, torneos y categorías pero no tiene forma de rastrear jugadores individuales. Agregar un módulo de jugadores permite asociar jugadores a equipos y gestionar sus perfiles.

## What Changes

- Nuevo módulo `players` con operaciones CRUD completas (crear, consultar, actualizar, eliminar)
- Entidad Player con atributos: id, name, email, phone, birthday, nationality, imageUrl, imagePublicId, active, createdAt, updatedAt
- Relación bidireccional: Player pertenece a un Team (FK opcional), Team tiene muchos Players
- API REST en `/api/v1/players` siguiendo las convenciones existentes (auth, paginación, versioning)

## Capabilities

### New Capabilities

- `player-management`: Operaciones CRUD para jugadores, asociación con equipos, gestión de perfiles

### Modified Capabilities

- `team-management`: Se agrega relación OneToMany con jugadores en la entidad Team

## Impact

- Nuevo directorio `src/players/` (entidad, DTOs, servicio, controlador, módulo, tests)
- Modificación de `src/teams/entities/team.entity.ts` — agregar relación `@OneToMany` hacia jugadores
- Modificación de `src/app.module.ts` — importar `PlayersModule`
- Nueva migración TypeORM para la tabla `players` con FK hacia `teams`
