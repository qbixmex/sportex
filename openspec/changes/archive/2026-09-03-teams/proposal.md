## Why

El sistema ya gestiona Torneos, Categorías y Usuarios, pero no existe la entidad Equipo. Para completar la gestión de un torneo deportivo se necesita poder registrar y administrar los equipos que participan. Un equipo se asocia a un torneo específico.

## What Changes

- Crear el módulo `teams` con CRUD completo (crear, consultar, actualizar y eliminar equipos).
- Un `Team` puede pertenecer a un único `Torneo`; un `Torneo` puede tener muchos `Team`s.
- El campo `tournament_id` es opcional: un equipo puede existir sin torneo asignado.
- Un `Team` puede pertenecer a una única `Categoría`; una `Categoría` puede tener muchos `Team`s.
- El campo `category_id` es opcional: un equipo puede existir sin categoría asignada.
- `name` y `permalink` NO son únicos: un mismo nombre (p. ej. "Colegio Alemán") puede repetirse en distintas categorías y torneos.
- No se agregan relaciones con `User` (jugadores/miembros) en este cambio — se contempla en un flujo futuro.
- El esquema se cambia mediante una migración de base de datos generada automáticamente (no se escribe migración a mano).

## Capabilities

### New Capabilities
- `team-management`: Gestión de equipos deportivos — creación, consulta, actualización y borrado de equipos, y su asociación opcional con un torneo.

### Modified Capabilities
<!-- No existing spec changes: team-management is a brand-new capability and no requirement of an existing one is modified. -->

## Impact

- **Nuevo código:** módulo `teams` (entidad `Team` y su API CRUD).
- **Modificación:** los módulos de torneos y categorías incorporan la relación inversa con los equipos.
- **Migración:** tabla `teams` con FK a `tournaments.id` y a `categories.id` (ambos nullable), generada automáticamente.
- **Convenciones existentes a seguir:** API versionada, endpoints protegidos con autenticación de administrador, ids UUID validados y paginación.