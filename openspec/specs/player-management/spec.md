# player-management Specification

## Purpose

Permite gestionar jugadores individuales dentro de la plataforma: crear, consultar, actualizar y eliminar jugadores, y asociarlos opcionalmente a un equipo existente.

## Requirements

### Requirement: Crear jugador
El sistema SHALL permitir crear un jugador con un nombre. El jugador MAY estar asociado a un equipo existente y MAY existir sin él. El jugador MAY tener email, teléfono, fecha de nacionalidad, nacionalidad, imagen y estado activo/inactivo.

#### Scenario: Crear jugador válido sin equipo
- **WHEN** se envía una solicitud de creación con un nombre válido y sin `teamId`
- **THEN** se crea el jugador con el nombre indicado, `teamId` nulo y `active` en `false` por defecto

#### Scenario: Crear jugador válido con equipo
- **WHEN** se envía una solicitud de creación con un nombre válido y un `teamId` que referencia un equipo existente
- **THEN** se crea el jugador asociado a dicho equipo

#### Scenario: Crear jugador con campos opcionales
- **WHEN** se envía una solicitud de creación con nombre, email, phone, birthday, nationality, imageUrl e imagePublicId
- **THEN** se crea el jugador con todos los campos opcionales guardados

#### Scenario: Crear jugador con equipo inexistente
- **WHEN** se intenta crear un jugador cuyo `teamId` no referencia un equipo existente
- **THEN** el sistema rechaza la creación y devuelve un error de validación

#### Scenario: Crear jugador sin nombre
- **WHEN** se envía una solicitud de creación sin nombre
- **THEN** el sistema rechaza la creación y devuelve un error de validación

### Requirement: Consultar jugadores
El sistema SHALL permitir listar jugadores con paginación y obtener un jugador individual por su id.

#### Scenario: Listar jugadores paginado
- **WHEN** se solicita la lista de jugadores con parámetros de paginación
- **THEN** el sistema devuelve una lista paginada de jugadores

#### Scenario: Obtener un jugador por id
- **WHEN** se solicita un jugador cuyo id existe
- **THEN** el sistema devuelve los datos de ese jugador, incluyendo su equipo asociado si lo tiene

#### Scenario: Obtener un jugador inexistente
- **WHEN** se solicita un jugador cuyo id no existe
- **THEN** el sistema devuelve un error de no encontrado

### Requirement: Actualizar jugador
El sistema SHALL permitir modificar los datos de un jugador existente, incluyendo su nombre, su `teamId` y todos sus atributos opcionales. El `teamId` MAY asignar o quitar su asociación con un equipo.

#### Scenario: Actualizar nombre de un jugador
- **WHEN** se actualiza el nombre de un jugador existente a un valor válido
- **THEN** el sistema guarda el nuevo nombre

#### Scenario: Asignar equipo a un jugador
- **WHEN** se actualiza el `teamId` de un jugador a un equipo existente
- **THEN** el jugador queda asociado a ese equipo

#### Scenario: Quitar equipo de un jugador
- **WHEN** se actualiza el `teamId` de un jugador a nulo
- **THEN** el jugador deja de estar asociado a ningún equipo

#### Scenario: Actualizar atributos opcionales de un jugador
- **WHEN** se actualizan campos opcionales como email, phone, birthday, nationality, imageUrl o imagePublicId
- **THEN** el sistema guarda los nuevos valores

#### Scenario: Actualizar estado activo/inactivo
- **WHEN** se actualiza el campo `active` de un jugador
- **THEN** el sistema guarda el nuevo estado

#### Scenario: Actualizar jugador inexistente
- **WHEN** se intenta actualizar un jugador cuyo id no existe
- **THEN** el sistema devuelve un error de no encontrado

### Requirement: Eliminar jugador
El sistema SHALL permitir eliminar un jugador existente por su id.

#### Scenario: Eliminar un jugador existente
- **WHEN** se elimina un jugador cuyo id existe
- **THEN** el jugador se elimina y ya no aparece en el listado

#### Scenario: Eliminar un jugador inexistente
- **WHEN** se intenta eliminar un jugador cuyo id no existe
- **THEN** el sistema devuelve un error de no encontrado
