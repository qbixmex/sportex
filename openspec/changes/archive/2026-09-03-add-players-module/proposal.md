## Why

La plataforma gestiona equipos, torneos y categorías pero no tiene forma de rastrear jugadores individuales. Registrar jugadores permite asociarlos a equipos y gestionar sus perfiles.

## What Changes

- Habilitar la gestión de jugadores: registrar, consultar, modificar y eliminar jugadores.
- Un jugador se identifica por su nombre y MAY tener correo electrónico, teléfono, fecha de nacimiento, nacionalidad, imagen y un estado activo/inactivo.
- Un jugador pertenece de forma opcional a un único equipo, y un equipo puede tener muchos jugadores.
- La gestión de jugadores sigue las reglas de acceso, paginación y versionado ya establecidas en la plataforma.

## Capabilities

### New Capabilities

- `player-management`: Gestión de jugadores: registrar, consultar, modificar y eliminar, con asociación opcional a un equipo y gestión de perfiles.

### Modified Capabilities

- `team-management`: La consulta de un equipo refleja la relación con sus jugadores.

## Impact

- La plataforma incorpora el registro y gestión de jugadores.
- Los equipos pueden mostrar los jugadores que los integran.
- Se habilita la consulta de equipos incluyendo su cantidad de jugadores.