## Why

La plataforma ya gestiona torneos, categorías y usuarios, pero no existe la entidad de negocio "equipo". Para completar la gestión de un torneo deportivo se necesita poder registrar y administrar los equipos que participan. Un equipo se asocia a un torneo específico.

## What Changes

- Habilitar la gestión de equipos: registrar, consultar, modificar y eliminar equipos.
- Un equipo puede pertenecer a un único torneo, y un torneo puede tener muchos equipos. La asignación de torneo es opcional: un equipo puede existir sin él.
- Un equipo puede pertenecer a una única categoría, y una categoría puede tener muchos equipos. La asignación de categoría es opcional: un equipo puede existir sin ella.
- El nombre y el enlace permanente de un equipo NO son únicos: un mismo nombre (p. ej. "Colegio Alemán") puede repetirse en distintas categorías y torneos.
- No se agregan relaciones con usuarios (jugadores/miembros) en este cambio; se contempla en un flujo futuro.
- La gestión de equipos sigue las reglas de acceso y de identificadores ya establecidas en la plataforma.

## Capabilities

### New Capabilities

- `team-management`: Gestión de equipos deportivos: registrar, consultar, modificar y eliminar equipos, y su asociación opcional con un torneo y una categoría.

### Modified Capabilities

- (Ninguno - team-management es una capacidad nueva y no se modifica ninguna existente)

## Impact

- La plataforma incorpora la gestión de equipos.
- Los torneos y categorías pueden mostrar los equipos que participan en ellos.
- La consulta de un torneo y de una categoría refleja sus equipos asociados.