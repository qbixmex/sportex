## Why

El sistema ya gestiona Torneos, Categorías y Usuarios, pero no existe la entidad Equipo. Para completar la gestión de un torneo deportivo se necesita poder registrar y administrar los equipos que participan. Un equipo se asocia a un torneo específico.

## What Changes

- Crear el módulo `teams` completo: entidad `Team`, DTOs, servicio y controlador con CRUD (`/api/v1/teams`).
- Un `Team` pertenece a un único `Torneo` (`ManyToOne` opcional); un `Torneo` puede tener muchos `Team`s (`OneToMany` inversa).
- El campo `tournament_id` es opcional: un equipo puede existir sin torneo asignado.
- Un `Team` pertenece a una única `Categoría` (`ManyToOne` opcional); una `Categoría` puede tener muchos `Team`s (`OneToMany` inversa).
- El campo `category_id` es opcional: un equipo puede existir sin categoría asignada.
- `name` y `permalink` NO son únicos: un mismo nombre (p. ej. "Colegio Alemán") puede repetirse en distintas categorías y torneos.
- No se agregan relaciones con `User` (jugadores/miembros) en este cambio — se contempla en un flujo futuro.
- El esquema se cambia vía entidad TypeORM y los cambios se reflejan en una migración generada con `migration:generate` (no se escribe migración a mano).

## Capabilities

### New Capabilities
- `team-management`: Gestión de equipos deportivos — creación, consulta, actualización y borrado de equipos, y su asociación opcional con un torneo.

### Modified Capabilities
<!-- No existing spec changes: team-management is a brand-new capability and no requirement of an existing one is modified. -->

## Impact

- **Nuevo código:** `src/teams/` — `entities/team.entity.ts`, `dto/create-team.dto.ts`, `dto/update-team.dto.ts`, `teams.service.ts`, `teams.controller.ts`, `teams.module.ts`.
- **Modificación:** `src/tournaments/entities/tournament.entity.ts` — relación inversa `teams` (`OneToMany`); `src/categories/entities/category.entity.ts` — relación inversa `teams` (`OneToMany`).
- **Migración:** tabla `teams` con FK a `tournaments.id` y a `categories.id` (ambos nullable), generada vía `bun run migration:generate`.
- **Convenciones existentes a seguir:** `@Auth(VALID_ROLES.ADMIN)`, `@Version('1')`, `ParseUUIDPipe` en `:id`, paginación con `@/common/dto/pagination.dto`, path aliases `@/*`.