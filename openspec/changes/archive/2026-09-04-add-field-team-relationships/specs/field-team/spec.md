## Purpose

Formaliza la relación muchos a muchos entre canchas y equipos, permitiendo gestionar las asociaciones de forma explícita: crear, reemplazar y eliminar asociaciones sin afectar a las canchas ni a los equipos.

## ADDED Requirements

### Requirement: Crear cancha con equipos asociados

El sistema SHALL permitir crear una cancha indicando los equipos que se van a asociar en el momento de la creación. La lista de equipos es opcional y hace referencia a equipos existentes.

#### Scenario: Crear cancha con equipos asociados
- **WHEN** se envía una solicitud de creación con un nombre y una lista de equipos existentes
- **THEN** se crea la cancha y queda asociada a los equipos indicados

### Requirement: Actualizar asociaciones de equipos y canchas

El sistema SHALL permitir actualizar un equipo y recibir las canchas a las que debe asociarse, y actualizar una cancha y recibir los equipos que deben quedar asociados. Al reemplazar las asociaciones, los registros de canchas y equipos SHALL NOT eliminarse.

#### Scenario: Actualizar equipo con canchas
- **WHEN** se actualiza un equipo con una lista de canchas
- **THEN** se actualizan las asociaciones del equipo sin eliminar las canchas

#### Scenario: Actualizar equipos asociados
- **WHEN** se actualiza una cancha con una lista de equipos
- **THEN** se reemplazan las asociaciones por las nuevas referencias sin eliminar los equipos

### Requirement: Eliminar cancha sin eliminar equipos

El sistema SHALL permitir eliminar una cancha sin eliminar los equipos asociados. Al eliminar la cancha, solo se deben eliminar sus asociaciones con equipos, nunca el registro de los equipos.

#### Scenario: Eliminar cancha sin eliminar equipos
- **WHEN** se elimina una cancha existente
- **THEN** se elimina la cancha y sus asociaciones con equipos, pero los equipos permanecen intactos

### Requirement: Asociar cancha con equipo

El sistema SHALL permitir asociar una cancha existente a un equipo existente. Un equipo MAY estar asociado a una o más canchas, y una cancha MAY ser utilizada por uno o más equipos.

#### Scenario: Asociar cancha y equipo existente
- **WHEN** se solicita crear una asociación entre una cancha y un equipo que existen
- **THEN** la cancha y el equipo quedan asociados

#### Scenario: Asociar cancha con equipo inexistente
- **WHEN** se intenta asociar una cancha o un equipo que no existe
- **THEN** el sistema rechaza la asociación y devuelve un error de validación

### Requirement: Consultar asociaciones de cancha

El sistema SHALL permitir consultar las asociaciones de una cancha específica, exponiendo los equipos asociados con su identificador, nombre y enlace permanente, y la cantidad total de equipos asociados.

#### Scenario: Obtener asociaciones de una cancha
- **WHEN** se consulta una cancha existente
- **THEN** el sistema devuelve sus equipos asociados con identificador, nombre y enlace permanente por cada uno

#### Scenario: Obtener cantidad de equipos asociados
- **WHEN** se consulta una cancha
- **THEN** el sistema incluye el número total de equipos asociados a la cancha