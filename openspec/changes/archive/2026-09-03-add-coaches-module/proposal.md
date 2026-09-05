## Why

La plataforma gestiona equipos y jugadores, pero carece de la figura del entrenador, un rol esencial dentro de cualquier organización deportiva. Se necesita poder gestionar entrenadores y asociarlos a los equipos que dirigen, cerrando así el modelo de staff deportivo.

## What Changes

- Habilitar la gestión de entrenadores: registrar, consultar, modificar y eliminar entrenadores, y asociarlos a los equipos que dirigen.
- Un entrenador se identifica por su nombre y su correo electrónico, único en toda la plataforma. Además MAY tener teléfono, edad, nacionalidad, imagen, descripción y un estado activo/inactivo.
- Un entrenador puede dirigir uno o varios equipos, y cada equipo cuenta a lo sumo con un entrenador asignado.
- La gestión de entrenadores sigue las reglas de acceso y de identificadores ya establecidas en la plataforma.

## Capabilities

### New Capabilities

- `coach-management`: Gestión de entrenadores: registrar, consultar (listado paginado y por identificador), modificar y eliminar entrenadores, con correo electrónico único y datos opcionales.

### Modified Capabilities

- `team-management`: un equipo ahora MAY estar asociado a un único entrenador, consultable y asignable/removible, y la consulta de equipos refleja su entrenador.

## Impact

- La plataforma incorpora la figura del entrenador y su gestión.
- Los equipos pueden contar con un entrenador asignado.
- El personal con rol de administración adquiere la facultad de gestionar entrenadores.