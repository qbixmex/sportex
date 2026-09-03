## Context

Ver `proposal.md - Why` y los deltas en `specs/coach-management/spec.md` y `specs/team-management/spec.md`.

La plataforma sigue un patrón de módulos CRUD por dominio bajo `src/modules/` (players, teams, tournaments, users), con `@Auth(role)` para proteger los endpoints, DTOs con `class-validator`, entidades TypeORM y migraciones (synchronize: false). `players` es el patrón de referencia más cercano: entidad con campos opcionales, servicio con `CommonService.handleExceptions`, controlador paginado y módulo que registra repos en TypeOrmModule.

La relación entrenador↔equipo es **1:N**: un entrenador dirige varios equipos y cada equipo tiene a lo sumo un entrenador. Esa FK vive en la tabla `teams` (`coach_id`).

## Goals / Non-Goals

**Goals:**
- Entidad y módulo `Coach` con CRUD completo siguiendo el patrón de `players`.
- Modelar la relación 1:N mediante una FK `coach_id` en `teams`, con `Coach.teams` (OneToMany) y `Team.coach` (ManyToOne).
- Definir el esquema de base de datos vía migración TypeORM y validar la unicidad del email.
- Exponer la API bajo `/api/v1/coaches...` protegida con `@Auth(role)`.

**Non-Goals:**
- No cambiar el modelo de autenticación ni el de usuarios (un coach no es un `User` en este cambio).
- No gestionar el rol de coach dentro de `users` ni la lógica de membresía.
- No tocar la relación jugador↔equipo existente.

## Decisions

### D1. Entity `Coach` con OneToMany hacia `Team`
Se modela `Coach` con `@OneToMany(() => Team, (team) => team.coach) teams: Team[]`. Cada `Team` gana una columna `coach_id` (`@ManyToOne` + `@JoinColumn`, `onDelete: 'SET NULL'`), de forma análoga a cómo `Team` ya referencia `tournament_id` y `category_id`.

- **Alternativa considerada**: tabla de unión M:N con `ManyToMany`. Se descarta porque la relación es **1:N** (un equipo tiene un único entrenador), no N:N; la FK en `teams` es más simple y no introduce tabla intermedia.

### D2. El DTO de `Coach` expone `teamIds: string[]` para asignar equipos
Al crear/actualizar un entrenador se acepta una lista opcional `teamIds[]`. El servicio asigna el `coach_id` de cada equipo referenciado (verificando que existan, igual que `ensureTeamExists` en `players`). A la inversa, el DTO de `Team` expone un `coachId` opcional (como `tournamentId`/`categoryId`) para asignar el entrenador desde el lado del equipo.

- **Racional**: el spec estipula que un entrenador puede dirigir varios equipos; exponer `teamIds` en el coach permite la gestión agregada, mientras `coachId` en el team cubre la asignación puntual.
- **Alternativa considerada**: gestionar la relación solo desde el DTO del equipo. Se descarta como única vía porque el caso de uso principal (asociar muchos equipos a un entrenador) sería verboso para el cliente.

### D3. Email único
`Coach.email` lleva una restricción de unicidad a nivel de entidad (`@Column({ unique: true })`) y en la migración (`ADD CONSTRAINT ... UNIQUE`). El servicio traduce el error de unicidad (PostgreSQL `23505`) vía `CommonService.handleExceptions` a un `ConflictException`/`BadRequestException`, de forma consistente con el manejo central de errores.

### D4. Endpoints y versionado
Controlador `CoachesController` con ruta base `coaches` bajo el prefijo global `api` y versionado URI `@Version('1')` → `/api/v1/coaches`. Endpoints: `POST /`, `GET /` (paginado), `GET /:id`, `PATCH /:id`, `DELETE /:id`, protegidos con `@Auth(role)` según los roles permitidos.

- **Racional**: replicar el patrón de `players` (paginación con `PaginationDto`, ParseUUIDPipe en `:id`, respuestas con `message`/`data` y paginación).

### D5. Migración TypeORM
Nueva migración que: crea la tabla `coaches` y añade la columna `coach_id` a `teams` con FK `ON DELETE SET NULL` y restricción única sobre `coaches.email`. Se genera con `bun run migration:generate` y se aplica con `bun run migration:run`.

## Risks / Trade-offs

- [Quitar la asociación de un equipo al entrenador borrado] → Mitigación: FK `ON DELETE SET NULL` en `teams.coach_id`, igual que `tournament_id`/`category_id`.
- [Email duplicado causa error 23505 de PostgreSQL] → Mitigación: restricción única + manejo central en `CommonService.handleExceptions`.
- [Validar `teamIds` inexistentes en creación] → Mitigación: verificación previa por cada id en el servicio (patrón `ensureTeamExists`).
- [Trade-off D1: tener FK en `teams` centraliza la relación en un lado] → Aceptado: es la modelación natural de una relación 1:N y evita tabla intermedia.

## Migration Plan

- Generar y aplicar una única migración (`add-coaches-module`) que cree `coaches` y agregue `teams.coach_id`.
- Rollback: `bun run migration:revert` revierte la migración (tabla y columna).

## Open Questions

- Ninguna por ahora: la modelación 1:N, el manejo de `teamIds`/`coachId` y la unicidad del email quedan resueltos y no dependen de decisiones posteriores.
