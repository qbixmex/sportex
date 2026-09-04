## Why

La plataforma gestiona equipos, jugadores, entrenadores, torneos y categorías, pero carece del concepto de canchas (fields): los lugares donde los equipos juegan. Se necesita un módulo de `fields` que permita registrar canchas y asociarlas a los equipos que las utilizan, estableciendo una relación muchos a muchos a través de una tabla pivote `field_team`.

## What Changes

- Crear el módulo `FieldsModule` en `src/modules/fields/` con entidad, servicio, controlador y DTOs.
- Crear la entidad `Field` (tabla `fields`) con los campos: `id` (uuid PK), `name`, `permalink` (opcional), `city` (opcional), `state` (opcional), `country` (opcional), `address` (opcional), `map` (opcional), `createdAt`, `updatedAt`.
- Crear la entidad pivote dedicada `FieldTeam` (tabla `field_team`) con columnas explícitas `fieldId` y `teamId` (PK compuesta), vinculando `Field` y `Team` (muchos a muchos).
- Añadir la relación inversa en la entidad `Team` para permitir consultar las canchas asociadas a un equipo.
- Exponer CRUD completo en `/api/v1/fields` (crear, listar paginado, obtener por id/permalink, actualizar, eliminar). Gestionado con `@Auth(VALID_ROLES.ADMIN)` y versionado `v1`, igual que el resto de módulos.
- Crear la migración TypeORM para las tablas `fields` y `field_team`.
- Registrar `FieldsModule` en `AppModule`.
- Sin cambios que rompan la API existente (**BREAKING**: ninguno; es una capacidad nueva).

## Capabilities

### New Capabilities
- `field-management`: Gestión de canchas (fields): crear, consultar, actualizar y eliminar canchas, y asociarlas a equipos vía la relación pivote `FieldTeam`.

### Modified Capabilities
- `team-management`: Se extiende el módulo de equipos para reflejar que un equipo MAY estar asociado a una o varias canchas (`fields`) a través de la tabla pivote `FieldTeam`. Cambia el comportamiento a nivel de especificación: la consulta de un equipo incluye sus canchas asociadas si las tiene.

## Impact

- **Código nuevo**: `src/modules/fields/entities/field.entity.ts`, `src/modules/fields/entities/field-team.entity.ts`, `src/modules/fields/dto/*`, `src/modules/fields/fields.service.ts`, `src/modules/fields/fields.controller.ts`, `src/modules/fields/fields.module.ts`, `src/modules/fields/fields.service.spec.ts`.
- **Modificaciones**: `src/modules/teams/entities/team.entity.ts` (relación `FieldTeam`), `src/app.module.ts` (registro del módulo).
- **Base de datos**: nueva migración que crea las tablas `fields` y `field_team` (esta última con PK compuesta `field_id` + `team_id`).
- **API**: nuevas rutas `/api/v1/fields` (CRUD).
