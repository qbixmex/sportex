## ADDED Requirements

### Requirement: Asociar un entrenador a un equipo
El sistema SHALL permitir asociar a cada equipo un único entrenador (`coachId`). Un entrenador MAY dirigir varios equipos, pero un equipo SHALL tener a lo sumo un entrenador asociado. El `coachId` MAY asignarse o quitarse opcionalmente en la creación y actualización de un equipo.

#### Scenario: Crear equipo con entrenador
- **WHEN** se envía una solicitud de creación de un equipo con un `coachId` que referencia un entrenador existente
- **THEN** el equipo queda asociado a ese entrenador

#### Scenario: Crear equipo sin entrenador
- **WHEN** se envía una solicitud de creación de un equipo sin `coachId`
- **THEN** el equipo se crea con `coachId` nulo

#### Scenario: Crear equipo con entrenador inexistente
- **WHEN** se intenta crear un equipo cuyo `coachId` no referencia un entrenador existente
- **THEN** el sistema rechaza la creación y devuelve un error de validación

#### Scenario: Asignar entrenador a un equipo
- **WHEN** se actualiza el `coachId` de un equipo a un entrenador existente
- **THEN** el equipo queda asociado a ese entrenador

#### Scenario: Quitar entrenador de un equipo
- **WHEN** se actualiza el `coachId` de un equipo a nulo
- **THEN** el equipo deja de estar asociado a ningún entrenador

#### Scenario: Consultar equipos con su entrenador
- **WHEN** se lista o consulta un equipo
- **THEN** el sistema incluye los datos de su entrenador asociado si lo tiene
