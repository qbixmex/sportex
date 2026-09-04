## Purpose

Formaliza la relación muchos a muchos entre canchas (fields) y equipos (teams) a través de la tabla pivote `field_team`, permitiendo gestionar las asociaciones de forma explícita.

## ADDED Requirements

### Requirement: Crear cancha con equipos asociados
El sistema SHALL permitir crear una cancha enviando los `id` de los equipos que se van a asociar en el momento de la creación. El `teamsId` es opcional y referencia equipos existentes.

#### Scenario: Crear cancha con equipos asociados
- **WHEN** se envía una solicitud de creación con `name` y un array `teamsId` con ids válidos
- **THEN** se crea la cancha y se generan las filas `field_team` correspondientes

### Requirement: Actualizar asociaciones de equipo
El sistema SHALL permitir actualizar un equipo y recibir los `id` de las canchas (`fieldsId`) a las que debe asociarse.

#### Scenario: Actualizar equipo con canchas
- **WHEN** se actualiza un equipo con un array `fieldsId`
- **THEN** se actualizan las asociaciones del equipo sin eliminar las canchas
El sistema SHALL permitir actualizar los equipos asociados a una cancha existente, recibiendo los `id` de los equipos que deben quedar asociados.

#### Scenario: Actualizar equipos asociados
- **WHEN** se actualiza una cancha con un array `teamsId`
- **THEN** se reemplazan las asociaciones por las nuevas referencias sin eliminar los equipos

### Requirement: Eliminar referencia de cancha sin eliminar equipo
El sistema SHALL permitir eliminar una cancha sin eliminar los equipos asociados. Al eliminar la cancha, solo se deben eliminar las referencias en `field_team`, nunca el registro del equipo.

#### Scenario: Eliminar cancha sin eliminar equipos
- **WHEN** se elimina una cancha existente
- **THEN** se elimina la cancha y sus referencias en `field_team`, pero los equipos permanecen intactos

### Requirement: Asociar cancha con equipo
El sistema SHALL permitir asociar una cancha existente a un equipo existente a través de la entidad pivote `FieldTeam`. Un equipo MAY estar asociado a una o más canchas, y una cancha MAY ser utilizada por uno o más equipos.

#### Scenario: Asociar cancha y equipo existente
- **WHEN** se solicita crear una asociación entre un `fieldId` y un `teamId` válidos
- **THEN** se crea la fila en `field_team` y la cancha y el equipo quedan asociados

#### Scenario: Asociar cancha con equipo inexistente
- **WHEN** se intenta asociar un `fieldId` o `teamId` que no existe
- **THEN** el sistema rechaza la asociación y devuelve un error de validación

### Requirement: Consultar asociaciones de cancha
El sistema SHALL permitir consultar las asociaciones de una cancha específica, exponiendo los equipos asociados con `id`, `name` y `permalink`, y la cantidad total de equipos asociados.

#### Scenario: Obtener asociaciones de una cancha
- **WHEN** se consulta una cancha existente
- **THEN** el sistema devuelve sus equipos asociados como array con `id`, `name` y `permalink` por cada uno, junto con la cantidad total

#### Scenario: Obtener cantidad de equipos asociados
- **WHEN** se consulta una cancha
- **THEN** el sistema incluye el número total de equipos asociados a la cancha
