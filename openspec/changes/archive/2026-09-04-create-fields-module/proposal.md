## Why

La plataforma gestiona equipos, jugadores, entrenadores, torneos y categorías, pero carece del concepto de canchas: los lugares donde los equipos juegan. Registrar canchas permite gestionarlas y asociarlas a los equipos que las utilizan, en una relación muchos a muchos.

## What Changes

- Habilitar la gestión de canchas: registrar, consultar, modificar y eliminar canchas.
- Una cancha se identifica por su nombre y MAY tener un enlace permanente (único cuando se define), ciudad, estado, país, dirección y mapa como datos opcionales.
- Una cancha puede ser utilizada por varios equipos, y un equipo puede utilizar varias canchas.
- La gestión de canchas sigue las reglas de acceso, paginación y versionado ya establecidas en la plataforma.
- Sin cambios que rompan la operación existente: es una capacidad nueva.

## Capabilities

### New Capabilities

- `field-management`: Gestión de canchas: registrar, consultar, modificar y eliminar canchas, y su asociación con equipos mediante una relación muchos a muchos.

### Modified Capabilities

- `team-management`: Se extiende la gestión de equipos para reflejar que un equipo MAY estar asociado a una o varias canchas; la consulta de un equipo incluye sus canchas asociadas si las tiene.

## Impact

- La plataforma incorpora el registro y gestión de canchas.
- Los equipos pueden mostrar las canchas que utilizan.
- Al eliminar una cancha se limpian sus asociaciones con equipos, sin afectar a los equipos.