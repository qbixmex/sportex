## Why

La relación muchos a muchos entre canchas y equipos existe en la plataforma, pero su gestión de asociaciones y su comportamiento de consulta necesitan quedar formalizados: qué significa asociar, consultar, reemplazar y eliminar esas asociaciones sin afectar a las canchas ni a los equipos.

## What Changes

- Formalizar la relación muchos a muchos entre canchas y equipos: una cancha puede ser utilizada por muchos equipos y un equipo puede utilizar muchas canchas.
- Al crear una cancha se MAY indicar los equipos que la utilizarán.
- Al actualizar una cancha o un equipo se pueden reemplazar sus asociaciones, sin eliminar los registros de los otros.
- Al eliminar una cancha solo se eliminan sus asociaciones con equipos; los equipos permanecen.
- Al consultar una cancha se incluyen sus equipos asociados y la cantidad total; al consultar un equipo se incluyen sus canchas asociadas.

## Capabilities

### New Capabilities

- `field-team`: Definición de la asociación muchos a muchos entre canchas y equipos: creación, reemplazo y eliminación de asociaciones.

### Modified Capabilities

- `field-management`: La consulta de una cancha incluye la cantidad de equipos asociados y su enlace permanente; la creación y actualización de una cancha aceptan la asociación con equipos; eliminar una cancha solo quita sus asociaciones.
- `team-management`: La actualización de un equipo acepta la asociación con canchas; la consulta de un equipo incluye sus canchas asociadas.

## Impact

- La plataforma formaliza las reglas de asociación entre canchas y equipos.
- Consultas de canchas y equipos exponen sus asociaciones y cantidades.
- La eliminación de una cancha nunca elimina los equipos asociados.