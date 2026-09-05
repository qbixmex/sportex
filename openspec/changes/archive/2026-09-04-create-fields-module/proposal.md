## Why

La plataforma gestiona equipos, jugadores, entrenadores, torneos y categorías, pero carece del concepto de canchas (fields): los lugares donde los equipos juegan. Se necesita un módulo de `fields` que permita registrar canchas y asociarlas a los equipos que las utilizan, estableciendo una relación muchos a muchos a través de una tabla pivote `field_team`.

## What Changes

- Crear el módulo `fields` con su API CRUD.
- Crear la entidad `Field` (tabla `fields`) con los campos: `id` (uuid PK), `name`, `permalink` (opcional), `city` (opcional), `state` (opcional), `country` (opcional), `address` (opcional), `map` (opcional), `createdAt`, `updatedAt`.
- Crear la entidad pivote dedicada `FieldTeam` (tabla `field_team`) con columnas explícitas `fieldId` y `teamId` (PK compuesta), vinculando `Field` y `Team` (muchos a muchos).
- Añadir la relación inversa en la entidad `Team` para permitir consultar las canchas asociadas a un equipo.
- Exponer CRUD completo de canchas (crear, listar paginado, obtener por id/permalink, actualizar, eliminar), protegido con autenticación de administrador y versionado, igual que el resto de módulos.
- Crear la migración de base de datos para las tablas `fields` y `field_team`.
- Registrar el módulo `fields` en la aplicación.
- Sin cambios que rompan la API existente (**BREAKING**: ninguno; es una capacidad nueva).

## Capabilities

### New Capabilities
- `field-management`: Gestión de canchas (fields): crear, consultar, actualizar y eliminar canchas, y asociarlas a equipos vía la relación pivote `FieldTeam`.

### Modified Capabilities
- `team-management`: Se extiende el módulo de equipos para reflejar que un equipo MAY estar asociado a una o varias canchas (`fields`) a través de la tabla pivote `FieldTeam`. Cambia el comportamiento a nivel de especificación: la consulta de un equipo incluye sus canchas asociadas si las tiene.

## Impact

- **Código nuevo**: módulo `fields` (entidades `Field` y `FieldTeam` y su API CRUD).
- **Modificaciones**: la entidad de equipo incorpora la relación con las canchas; el módulo se registra en la aplicación.
- **Base de datos**: nueva migración que crea las tablas `fields` y `field_team` (esta última con PK compuesta `field_id` + `team_id`).
- **API**: nuevas rutas de `fields` (CRUD).
