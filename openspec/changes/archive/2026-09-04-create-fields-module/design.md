## Context

Módulos de la plataforma ubicados bajo `src/modules/` (teams, players, coaches, categories, tournaments). Cada módulo sigue el patrón: entidades en `entities/`, DTOs en `dto/`, y un `service`, `controller` y `module`. Los controladores usan `@Auth(VALID_ROLES.ADMIN)`, versionado `@Version('1')` y rutas bajo el prefijo global `api` → `/api/v1/<recurso>`. El esquema de la base de datos se gestiona con migraciones TypeORM (`synchronize: false`) generadas vía `bun run migration:generate`. La relación muchos a muchos existente `category_tournament` usa `@ManyToMany` + `@JoinTable()`.

Este diseño introduce `fields` con una tabla pivote dedicada `FieldTeam` como entidad propia (decisión explícita del producto), a diferencia de la `@JoinTable()` auto-generada de `category_tournament`. Ver `proposal.md` para la motivación y `specs/` para los requisitos.

## Goals / Non-Goals

**Goals:**
- CRUD completo de canchas en `/api/v1/fields` siguiendo el patrón de `categories`/`teams`.
- Entidades `Field` y `FieldTeam` con mapeo explícito de columnas.
- Migración TypeORM que crea `fields` y `field_team` (PK compuesta `field_id` + `team_id`).
- Relación bidireccional `Field` ↔ `Team` a través de `FieldTeam`.

**Non-Goals:**
- Endpoints dedicados para gestionar asociaciones (asignar/desasignar equipos de una cancha) en esta iteración; la asociación se materializa por el lado de los datos, pero no se expone un endpoint de gestión de pivote aún.
- Módulo separado para `FieldTeam`; vive dentro de `fields`.

## Decisions

### 1. `FieldTeam` como entidad dedicada (no `@JoinTable()`)
Aunque el proyecto ya usa `@JoinTable()` para `category_tournament`, el producto pide explícitamente una tabla pivote llamada `FieldTeam` con columnas `fieldId` y `teamId`. Una entidad dedicada permite: PK compuesta explícita, control sobre la tabla y la posibilidad de añadir columnas a la asociación en el futuro.

- **Alternativa**: `@JoinTable({ name: 'field_team', joinColumn: { name: 'field_id' }, inverseJoinColumn: { name: 'team_id' } })` en `Field`. Se descartó por la decisión explícita del producto y la mayor flexibilidad de la entidad dedicada.

### 2. PK compuesta en `FieldTeam`
`field_id` + `team_id` como clave primaria compuesta. Garantiza que una misma cancha no se asocie dos veces al mismo equipo a nivel de base de datos. Se modela con dos `@ManyToOne` (Field y Team) marcadas como primarias vía `@PrimaryColumn` + `@ManyToOne`.

- **Alternativa**: PK autogenerada `uuid` + único compuesto en `(field_id, team_id)`. Se descartó: la PK compuesta es más simple y correcta para el par.

### 3. Columnas `id` como uuid generado
La propuesta menciona `id: text`, pero el código existente usa `@PrimaryGeneratedColumn('uuid')` en todas las entidades. Se adopta uuid generado por consistencia con el resto del proyecto (decisión confirmada con el producto).

### 4. Consulta de canchas incluye equipos (solo `id` y `name`)
Al obtener una cancha se incluyen sus equipos asociados exponiendo únicamente `id` y `name`, igual que el patrón de `team.player` / `player.name`. Se implementa con `QueryBuilder` + `leftJoinAndSelect` seleccionando solo esos campos.

### 5. Sin endpoint de gestión de pivote
Solo se entrega CRUD de canchas. La relación `FieldTeam` queda definida en el modelo y la migración para que sea consultable, dejando los endpoints de asignación para una iteración futura.

## Risks / Trade-offs

- [La entidad pivote dedicada añade más código que un `@JoinTable()`] → Mitigation: es una decisión deliberada del producto; la entidad es pequeña y se mantiene dentro del módulo `fields`.
- [Eliminar una cancha deja huérfanas sus filas en `field_team`] → Mitigation: `onDelete: CASCADE` en la relación `FieldTeam.field` para que se limpien automáticamente.
- [No hay endpoint para asignar equipos en esta iteración] → Mitigation: se documenta como Non-Goal; la migración y relaciones quedan listas para la futura gestión del pivote.

## Migration Plan

1. Definir las entidades `Field` y `FieldTeam`.
2. Generar la migración con `bun run migration:generate --name=create-field-team-table`.
3. Aplicarla con `bun run migration:run` (requiere base de datos levantada).
4. Rollback con `bun run migration:revert` (el `down` elimina `field_team` y `fields`).

## Open Questions

Ninguna que cambie la especificación, el enfoque o el desglose de tareas.
