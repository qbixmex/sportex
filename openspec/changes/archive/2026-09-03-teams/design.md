## Context

El proyecto usa NestJS 12, TypeORM y PostgreSQL 16. Los módulos de dominio siguen un patrón uniforme observable en `tournaments/`: entidad en `entities/`, DTOs en `dto/`, service, controller y module, con `TypeOrmModule.forFeature`, `AuthModule` y `CommonModule` importados. Las rutas reales son `/api/v1/...` (prefijo global `api` + `@Version('1')`). Los controladores de dominio están protegidos con `@Auth(VALID_ROLES.ADMIN)` y usan `ParseUUIDPipe` en los `:id`. El esquema se gestiona por migraciones TypeORM con `synchronize: false`.

Motivación en proposal.md – Why.

## Goals / Non-Goals

**Goals:**
- CRUD completo de equipos bajo `src/teams/` siguiendo el patrón de `tournaments`.
- Relación `Team.tournament` (`ManyToOne` nullable) ↔ `Tournament.teams` (`OneToMany`) inversa.
- Relación `Team.category` (`ManyToOne` nullable) ↔ `Category.teams` (`OneToMany`) inversa.
- `tournament_id` y `category_id` FK nullable en la tabla `teams`, permitiendo equipos sin torneo ni categoría.
- `name` y `permalink` no únicos: repetibles en distintas categorías y torneos.
- Esquema aplicado mediante migraciones generadas, no escritas a mano.

**Non-Goals:**
- No relación con `User` (jugadores/miembros). Se agrega en un flujo futuro.
- No lógica de inscripción, fixture ni resultados de partidos.
- No escritura manual de migraciones; se generan vía `bun run migration:generate`.

## Decisions

**1. Módulo `teams` con patrón idéntico a `tournaments`**
Replicar `tournaments.module.ts`: `controllers: [TeamsController]`, `providers: [TeamsService]`, `imports: [ConfigModule, TypeOrmModule.forFeature([Team]), AuthModule, CommonModule]`. Rationale: consistencia de la base; alternativas (módulo compartido genérico) no existen aún y añadirían abstracción innecesaria.

**2. Relación `Team --ManyToOne--> Tournament` (nullable)**
`@ManyToOne(() => Tournament, (t) => t.teams, { onDelete: 'SET NULL' }) @JoinColumn({ name: 'tournament_id' })`. Lado inverso `@OneToMany(() => Team, (team) => team.tournament) teams!: Team[]` en `tournament.entity.ts`. Rationale: dominio "equipo de un torneo", pero el usuario confirmó que un equipo puede existir sin torneo → FK nullable. `ON DELETE SET NULL` para que eliminar un torneo no borre los equipos (consistente con el requerimiento de equipos sin torneo). Alternativa `CASCADE` descartada: borraría equipos.

**3. `name` y `permalink` NO únicos**
Sin `unique: true`; ambos pueden repetirse en distintas categorías y torneos (p. ej. "Colegio Alemán" en varias categorías). La unicidad real es contextual (`name`/`permalink` por par `tournament`+`category`), pero se decide NO aplicar un índice único compuesto; solo un índice simple compuesto `(permalink, format)` acelera consultas. El servicio NO valida duplicados por `name`.

**4. Migración generada, no escrita**
Definir la entidad y ejecutar `bun run migration:generate --name=create_teams_table` + `bun run migration:run` en terminal. Rationale: evita migraciones manuales propensas a errores y mantiene `synchronize: false` coherente. La FK a `tournaments(id)` se incluye automáticamente según los decoradores de relación.

**5. Relación `Team --ManyToOne--> Category` (nullable)**
`@ManyToOne(() => Category, (c) => c.teams, { onDelete: 'SET NULL' }) @JoinColumn({ name: 'category_id' })`. Lado inverso `@OneToMany(() => Team, (team) => team.category) teams!: Team[]` en `category.entity.ts`. Rationale: dominio "equipo de una categoría"; el usuario confirmó que un equipo puede existir sin categoría → FK nullable. `ON DELETE SET NULL` para que eliminar una categoría no borre los equipos. Alternativa `CASCADE` descartada: borraría equipos.

**6. Actualización con `Repository.merge()`**
`update()` asigna campos escalares con `this.teamRepository.merge(team, dto)` (mismo patrón que `tournaments`); solo `tournamentId` y `categoryId` se tratan explícitamente porque las relaciones se mapean por `@JoinColumn` y no por propiedades planas del DTO.

## Risks / Trade-offs

- [FK nullable + ON DELETE SET NULL] → Mitigation: validar al asignar torneo que el id exista (requerimiento de torneo inexistente rechaza).
- [Migración generada puede diferir entre entornos] → Mitigation: generarla tras definir la entidad y revisarla antes de aplicarla (`migration:run`).
- [Singular/plural: tabla `teams`, entidad `Team`] → Mitigation: seguir la convención existente (`tournaments`/`Tournament`).

## Migration Plan

1. Definir `Team`, modificar `Tournament` (relación inversa) y `Category` (relación inversa).
2. Ejecutar `bun run migration:generate --name=create_teams_table`.
3. Revisar la migración generada (tabla `teams`, FK `tournament_id` y `category_id` nullable con `ON DELETE SET NULL`).
4. Ejecutar `bun run migration:run`.
5. Tras añadir la relación `category`, ejecutar `bun run migration:generate --name=update_teams_table` y `bun run migration:run` (agrega `category_id` + FK).
6. Rollback si es necesario: `bun run migration:revert`.

## Open Questions

Ninguna. El alcance quedó resuelto: FK nullable, sin relación con usuarios, migración generada.